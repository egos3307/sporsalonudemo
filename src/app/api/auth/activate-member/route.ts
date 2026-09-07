import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { signSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { code, password, confirmPassword } = await req.json();

    if (!code || !password) {
      return NextResponse.json(
        { error: 'Lütfen tüm alanları doldurun.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Girdiğiniz şifreler eşleşmiyor.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifre en az 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const member = await prisma.member.findUnique({
      where: { memberCode: cleanCode },
      include: {
        gym: true,
        user: true,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Müşteri kodu bulunamadı.' },
        { status: 404 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    let userId = member.userId;

    if (!userId) {
      // Check if user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: member.email.toLowerCase().trim() },
      });

      if (existingUser) {
        // Update user password and link
        await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            passwordHash,
            gymId: member.gymId,
            role: 'MEMBER',
          },
        });
        userId = existingUser.id;
      } else {
        // Create user
        const newUser = await prisma.user.create({
          data: {
            gymId: member.gymId,
            email: member.email.toLowerCase().trim(),
            passwordHash,
            name: `${member.firstName} ${member.lastName}`,
            phone: member.phone,
            role: 'MEMBER',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.firstName}`,
          },
        });
        userId = newUser.id;
      }

      await prisma.member.update({
        where: { id: member.id },
        data: {
          userId,
          status: member.status === 'PENDING_ACTIVATION' ? 'ACTIVE' : member.status,
        },
      });

      await prisma.timelineEvent.create({
        data: {
          gymId: member.gymId,
          memberId: member.id,
          type: 'STATUS_CHANGE',
          title: 'Mobil Hesap Aktifleştirildi',
          description: 'Müşteri kodu doğrulanıp mobil şifre oluşturuldu.',
        },
      });
    } else {
      // User already exists, update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash },
      });
    }

    const token = await signSessionToken({
      userId: userId!,
      gymId: member.gymId,
      email: member.email,
      name: `${member.firstName} ${member.lastName}`,
      role: 'MEMBER',
      memberId: member.id,
    });

    const response = NextResponse.json({
      success: true,
      redirectUrl: '/member',
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
    console.error('Activate member error:', error);
    return NextResponse.json(
      { error: 'Aktivasyon sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
