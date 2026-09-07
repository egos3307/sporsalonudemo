import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { signSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Lütfen e-posta ve şifrenizi girin.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
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

    const isValid = await bcrypt.compare(password, user.passwordHash);
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

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
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
