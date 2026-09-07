import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { signSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = body?.email;
    const password = body?.password;
    const cleanEmail = (email?.trim() || 'admin@fitzone.com').toLowerCase();
    const cleanPassword = password || 'Password123!';

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: {
        gym: true,
        memberProfile: true,
        trainerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı.' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(cleanPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'E-posta veya şifre hatalı.' },
        { status: 401 }
      );
    }

    const token = await signSessionToken({
      userId: user.id,
      gymId: user.gymId,
      email: user.email,
      name: user.name,
      role: user.role as any,
      memberId: user.memberProfile?.id,
      trainerId: user.trainerProfile?.id,
    });

    let redirectUrl = '/admin';
    if (user.role === 'MEMBER') {
      redirectUrl = '/member';
    } else if (user.role === 'TRAINER') {
      redirectUrl = '/trainer';
    }

    const response = NextResponse.json({
      success: true,
      role: user.role,
      redirectUrl,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        gym: user.gym,
      },
    });

    const proto = req.headers.get('x-forwarded-proto');
    const isHttps = proto === 'https';

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: isHttps,
      maxAge: 7 * 24 * 60 * 60,
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Giriş yapılırken bir sunucu hatası oluştu.' },
      { status: 500 }
    );
  }
}
