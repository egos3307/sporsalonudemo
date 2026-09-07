import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const member = await prisma.member.findFirst({
      where: {
        id: params.id,
        gymId: context.gymId, // Multi-tenant IDOR check
      },
      include: {
        trainer: {
          include: {
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        user: {
          select: { id: true, email: true, name: true, avatar: true },
        },
        workoutPlans: {
          where: { isActive: true },
          include: {
            days: {
              include: { exercises: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        dietPlans: {
          where: { isActive: true },
          include: {
            meals: {
              include: { items: true },
              orderBy: { order: 'asc' },
            },
          },
        },
        measurements: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        checkIns: {
          orderBy: { checkInTime: 'desc' },
          take: 15,
        },
        timelineEvents: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Üye bulunamadı veya bu spor salonuna ait değil.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: 'Üye detayları yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.isExpired) {
    return NextResponse.json(
      { error: 'Deneme süreniz sona erdi. Düzenleme yapmak için hesabınızı aktifleştirin.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();

    // Verify ownership
    const existing = await prisma.member.findFirst({
      where: { id: params.id, gymId: context.gymId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Üye bulunamadı.' }, { status: 404 });
    }

    const {
      firstName,
      lastName,
      phone,
      status,
      trainerId,
      targetGoal,
      targetCalories,
      targetWaterMl,
      notes,
      extendDays,
    } = body;

    const dataToUpdate: any = {};
    if (firstName) dataToUpdate.firstName = firstName.trim();
    if (lastName) dataToUpdate.lastName = lastName.trim();
    if (phone !== undefined) dataToUpdate.phone = phone?.trim() || null;
    if (status) dataToUpdate.status = status;
    if (trainerId !== undefined) dataToUpdate.trainerId = trainerId || null;
    if (targetGoal) dataToUpdate.targetGoal = targetGoal.trim();
    if (targetCalories) dataToUpdate.targetCalories = Number(targetCalories);
    if (targetWaterMl) dataToUpdate.targetWaterMl = Number(targetWaterMl);
    if (notes !== undefined) dataToUpdate.notes = notes?.trim() || null;

    if (extendDays && Number(extendDays) > 0) {
      const currentEnd = new Date(existing.membershipEnd);
      const baseDate = currentEnd > new Date() ? currentEnd : new Date();
      dataToUpdate.membershipEnd = new Date(baseDate.getTime() + Number(extendDays) * 24 * 60 * 60 * 1000);
      dataToUpdate.status = 'ACTIVE';

      await prisma.timelineEvent.create({
        data: {
          gymId: context.gymId,
          memberId: existing.id,
          type: 'STATUS_CHANGE',
          title: 'Üyelik Süresi Uzatıldı',
          description: `Üyelik ${extendDays} gün uzatıldı. Yeni bitiş tarihi: ${dataToUpdate.membershipEnd.toLocaleDateString('tr-TR')}`,
        },
      });
    }

    const updated = await prisma.member.update({
      where: { id: params.id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json(
      { error: 'Üye güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}
