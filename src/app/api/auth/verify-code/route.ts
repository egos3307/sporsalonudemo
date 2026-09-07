import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Lütfen spor salonunuzdan aldığınız müşteri kodunu girin.' },
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
        { error: 'Geçersiz müşteri kodu. Lütfen spor salonunuzla iletişime geçin.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      member: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        hasAccount: !!member.userId,
      },
      gym: {
        id: member.gym.id,
        name: member.gym.name,
        logo: member.gym.logo,
        primaryColor: member.gym.primaryColor,
        address: member.gym.address,
      },
    });
  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Kod doğrulanırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
