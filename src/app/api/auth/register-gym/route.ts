import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { signSessionToken, COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { gymName, ownerName, email, phone, password, confirmPassword } = await req.json();

    if (!gymName || !ownerName || !email || !password) {
      return NextResponse.json(
        { error: 'Lütfen zorunlu tüm alanları doldurun.' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Girdiğiniz şifreler birbiriyle eşleşmiyor.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Şifreniz en az 6 karakter olmalıdır.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresiyle kayıtlı bir hesap zaten bulunuyor.' },
        { status: 400 }
      );
    }

    // Generate slug from gym name
    let baseSlug = gymName
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!baseSlug) baseSlug = 'salon';

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.gym.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 Days Free Trial

    // Create Gym + Admin in transaction
    const result = await prisma.$transaction(async (tx) => {
      const gym = await tx.gym.create({
        data: {
          name: gymName.trim(),
          slug,
          ownerName: ownerName.trim(),
          email: cleanEmail,
          phone: phone?.trim() || null,
          trialStart: now,
          trialEndsAt: trialEndsAt,
          subscriptionStatus: 'TRIAL',
          primaryColor: '#22c55e',
          accentColor: '#10b981',
        },
      });

      const user = await tx.user.create({
        data: {
          gymId: gym.id,
          name: ownerName.trim(),
          email: cleanEmail,
          phone: phone?.trim() || null,
          passwordHash,
          role: 'GYM_ADMIN',
        },
      });

      // Welcome notification
      await tx.notification.create({
        data: {
          gymId: gym.id,
          userId: user.id,
          title: 'GymOS Platformuna Hoş Geldiniz! 🚀',
          message: `${gym.name} için 7 günlük ücretsiz deneme süreniz başladı. Tüm özellikleri sınırsızca deneyimleyebilirsiniz.`,
          type: 'SYSTEM',
        },
      });

      return { gym, user };
    });

    const token = await signSessionToken({
      userId: result.user.id,
      gymId: result.gym.id,
      email: result.user.email,
      name: result.user.name,
      role: 'GYM_ADMIN',
    });

    const response = NextResponse.json({
      success: true,
      redirectUrl: '/admin',
      gym: result.gym,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
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
    console.error('Register gym error:', error);
    return NextResponse.json(
      { error: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.' },
      { status: 500 }
    );
  }
}
