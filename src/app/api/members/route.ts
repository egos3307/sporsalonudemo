import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext, TenantContext } from '@/lib/tenant';
import { generateMemberCode } from '@/lib/utils';

export async function GET(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.trim() || '';
  const status = searchParams.get('status') || '';
  const trainerId = searchParams.get('trainerId') || '';
  const expiring = searchParams.get('expiring') === 'true';

  try {
    const whereClause: any = {
      gymId: context.gymId,
    };

    // If Trainer role, restrict to their assigned members
    if (context.role === 'TRAINER') {
      const trainer = await prisma.trainer.findUnique({
        where: { userId: context.session.userId },
      });
      if (trainer) {
        whereClause.trainerId = trainer.id;
      }
    } else if (trainerId) {
      whereClause.trainerId = trainerId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { memberCode: { contains: search.toUpperCase() } },
        { phone: { contains: search } },
      ];
    }

    if (expiring) {
      const now = new Date();
      const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      whereClause.membershipEnd = {
        gte: now,
        lte: in7Days,
      };
      whereClause.status = 'ACTIVE';
    }

    const members = await prisma.member.findMany({
      where: whereClause,
      include: {
        trainer: {
          include: {
            user: { select: { name: true, email: true, avatar: true } },
          },
        },
        _count: {
          select: {
            checkIns: true,
            workoutPlans: true,
            measurements: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, members });
  } catch (error) {
    console.error('Fetch members error:', error);
    return NextResponse.json(
      { error: 'Üyeler yüklenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  // Check trial expiration restriction
  if (context.isExpired) {
    return NextResponse.json(
      { error: 'Deneme süreniz sona erdi. Yeni üye eklemek için lütfen aboneliğinizi aktifleştirin.' },
      { status: 403 }
    );
  }

  // Only GYM_ADMIN or SUPER_ADMIN can create members
  if (context.role !== 'GYM_ADMIN' && context.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Bu işlem için gym admin yetkisi gereklidir.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      gender,
      durationMonths = 1,
      trainerId,
      targetGoal,
      targetCalories,
      targetWaterMl,
      notes,
    } = body;

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: 'Ad, Soyad ve E-posta alanları zorunludur.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if member already exists in this gym
    const existing = await prisma.member.findFirst({
      where: {
        gymId: context.gymId,
        email: cleanEmail,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Bu e-posta adresiyle bu salonda kayıtlı bir üye zaten mevcut.' },
        { status: 400 }
      );
    }

    // Generate unique member code
    let memberCode = generateMemberCode('GYM');
    while (await prisma.member.findUnique({ where: { memberCode } })) {
      memberCode = generateMemberCode('GYM');
    }

    const now = new Date();
    const membershipEnd = new Date(now.getTime() + Number(durationMonths) * 30 * 24 * 60 * 60 * 1000);

    const member = await prisma.member.create({
      data: {
        gymId: context.gymId,
        memberCode,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: cleanEmail,
        phone: phone?.trim() || null,
        gender: gender || 'ERKEK',
        membershipStart: now,
        membershipEnd,
        status: 'PENDING_ACTIVATION',
        trainerId: trainerId || null,
        targetGoal: targetGoal?.trim() || 'Genel Kondisyon & Form',
        targetCalories: targetCalories ? Number(targetCalories) : 2200,
        targetWaterMl: targetWaterMl ? Number(targetWaterMl) : 3000,
        notes: notes?.trim() || null,
      },
      include: {
        trainer: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Create initial timeline event
    await prisma.timelineEvent.create({
      data: {
        gymId: context.gymId,
        memberId: member.id,
        type: 'REGISTERED',
        title: 'Üye Kaydı Oluşturuldu',
        description: `Müşteri Kodu: ${memberCode}. ${durationMonths} aylık paket tanımlandı.`,
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json(
      { error: 'Üye oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
