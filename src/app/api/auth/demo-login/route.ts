import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    let targetEmail = 'admin@fitzone.com';
    let expectedRole = 'GYM_ADMIN';

    if (role === 'trainer') {
      targetEmail = 'murat@fitzone.com';
      expectedRole = 'TRAINER';
    } else if (role === 'member') {
      targetEmail = 'caner@gmail.com';
      expectedRole = 'MEMBER';
    } else if (role === 'expired_admin') {
      targetEmail = 'admin@apexfit.com';
      expectedRole = 'GYM_ADMIN';
    }

    const user = await prisma.user.findUnique({
      where: { email: targetEmail },
      include: {
        gym: true,
        memberProfile: true,
        trainerProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Demo kullanıcısı bulunamadı. Lütfen "npm run seed" çalıştırın.' },
        { status: 404 }
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
    console.error('Demo login error:', error);
    return NextResponse.json(
      { error: 'Demo girişi yapılırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
