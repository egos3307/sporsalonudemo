import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';
import * as bcrypt from 'bcryptjs';

export async function GET() {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const trainers = await prisma.trainer.findMany({
      where: { gymId: context.gymId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            phone: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            members: true,
            workoutPlans: true,
            dietPlans: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, trainers });
  } catch (error) {
    console.error('Fetch trainers error:', error);
    return NextResponse.json(
      { error: 'Antrenörler yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.isExpired) {
    return NextResponse.json(
      { error: 'Deneme süreniz sona erdi. Yeni antrenör eklemek için hesabınızı aktifleştirin.' },
      { status: 403 }
    );
  }

  if (context.role !== 'GYM_ADMIN' && context.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Yalnızca salon yöneticisi antrenör hesabı açabilir.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, phone, specialties, bio, password = 'Password123!' } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Ad Soyad ve E-posta zorunludur.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Bu e-posta adresiyle kayıtlı bir kullanıcı zaten var.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        gymId: context.gymId,
        email: cleanEmail,
        passwordHash,
        name: name.trim(),
        phone: phone?.trim() || null,
        role: 'TRAINER',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      },
    });

    const trainer = await prisma.trainer.create({
      data: {
        gymId: context.gymId,
        userId: user.id,
        specialties: specialties?.trim() || 'Genel Fitness & Kondisyon',
        bio: bio?.trim() || null,
        phone: phone?.trim() || null,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ success: true, trainer });
  } catch (error) {
    console.error('Create trainer error:', error);
    return NextResponse.json(
      { error: 'Antrenör oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
