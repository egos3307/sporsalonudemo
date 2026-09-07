import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('memberId');

  try {
    const whereClause: any = {
      gymId: context.gymId,
    };

    if (context.role === 'MEMBER') {
      if (!context.session.memberId) {
        return NextResponse.json({ error: 'Üye profili bulunamadı.' }, { status: 404 });
      }
      whereClause.memberId = context.session.memberId;
    } else if (context.role === 'TRAINER') {
      const trainer = await prisma.trainer.findUnique({
        where: { userId: context.session.userId },
      });
      if (trainer) {
        whereClause.OR = [
          { trainerId: trainer.id },
          { member: { trainerId: trainer.id } },
        ];
      }
    } else if (memberId) {
      whereClause.memberId = memberId;
    }

    const plans = await prisma.workoutPlan.findMany({
      where: whereClause,
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            memberCode: true,
          },
        },
        trainer: {
          include: {
            user: { select: { name: true } },
          },
        },
        days: {
          include: {
            exercises: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, plans });
  } catch (error) {
    console.error('Fetch workouts error:', error);
    return NextResponse.json(
      { error: 'Antrenman programları yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.isExpired) {
    return NextResponse.json(
      { error: 'Deneme süreniz doldu. Yeni program oluşturmak için lütfen hesabınızı aktifleştirin.' },
      { status: 403 }
    );
  }

  if (context.role === 'MEMBER') {
    return NextResponse.json(
      { error: 'Üyeler yeni antrenman programı oluşturamaz.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { memberId, title, description, days } = body;

    if (!memberId || !title || !Array.isArray(days) || days.length === 0) {
      return NextResponse.json(
        { error: 'Lütfen üye seçimi, program başlığı ve en az bir gün ekleyin.' },
        { status: 400 }
      );
    }

    // Verify member belongs to this gym
    const member = await prisma.member.findFirst({
      where: { id: memberId, gymId: context.gymId },
    });

    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı.' }, { status: 404 });
    }

    let trainerId: string | null = null;
    if (context.role === 'TRAINER') {
      const trainer = await prisma.trainer.findUnique({
        where: { userId: context.session.userId },
      });
      trainerId = trainer?.id || null;
    } else if (member.trainerId) {
      trainerId = member.trainerId;
    }

    // Deactivate previous active plans for this member
    await prisma.workoutPlan.updateMany({
      where: { memberId, gymId: context.gymId, isActive: true },
      data: { isActive: false },
    });

    // Create new plan with nested days and exercises
    const newPlan = await prisma.workoutPlan.create({
      data: {
        gymId: context.gymId,
        memberId,
        trainerId,
        title: title.trim(),
        description: description?.trim() || null,
        isActive: true,
        days: {
          create: days.map((day: any, dIdx: number) => ({
            dayName: day.dayName || `Gün ${dIdx + 1}`,
            focus: day.focus || 'Genel',
            order: dIdx + 1,
            exercises: {
              create: (day.exercises || []).map((ex: any, eIdx: number) => ({
                name: ex.name,
                sets: Number(ex.sets) || 3,
                reps: String(ex.reps || '10-12'),
                weight: ex.weight ? String(ex.weight) : null,
                restTimeSeconds: Number(ex.restTimeSeconds) || 60,
                notes: ex.notes || null,
                videoUrl: ex.videoUrl || null,
                order: eIdx + 1,
              })),
            },
          })),
        },
      },
      include: {
        days: {
          include: { exercises: true },
        },
      },
    });

    // Record timeline event
    await prisma.timelineEvent.create({
      data: {
        gymId: context.gymId,
        memberId,
        type: 'WORKOUT_ASSIGNED',
        title: 'Yeni Antrenman Programı Tanımlandı',
        description: `"${title}" adlı program antrenörünüz tarafından atandı.`,
      },
    });

    // Create notification for member
    await prisma.notification.create({
      data: {
        gymId: context.gymId,
        memberId,
        title: 'Yeni Antrenman Programınız Hazır! 💪',
        message: `"${title}" adlı yeni antrenman programınız profilinize eklendi.`,
        type: 'WORKOUT',
      },
    });

    return NextResponse.json({ success: true, plan: newPlan });
  } catch (error) {
    console.error('Create workout plan error:', error);
    return NextResponse.json(
      { error: 'Antrenman programı oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
