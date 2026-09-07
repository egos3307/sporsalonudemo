import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const { workoutDayTitle, durationMinutes = 45, completedExercises = [], notes } = await req.json();

    let targetMemberId = context.session.memberId;
    if (!targetMemberId) {
      const { memberId } = await req.json().catch(() => ({}));
      targetMemberId = memberId;
    }

    if (!targetMemberId) {
      return NextResponse.json(
        { error: 'Antrenman kaydı yapılacak üye profili belirlenemedi.' },
        { status: 400 }
      );
    }

    const log = await prisma.workoutLog.create({
      data: {
        gymId: context.gymId,
        memberId: targetMemberId,
        workoutDayTitle: workoutDayTitle || 'Günlük Antrenman',
        durationMinutes: Number(durationMinutes) || 45,
        completedExercises: JSON.stringify(completedExercises),
        notes: notes?.trim() || null,
        completedDate: new Date(),
      },
    });

    // Record timeline event
    await prisma.timelineEvent.create({
      data: {
        gymId: context.gymId,
        memberId: targetMemberId,
        type: 'WORKOUT_COMPLETED',
        title: 'Antrenman Tamamlandı 🔥',
        description: `"${workoutDayTitle}" seansı ${durationMinutes} dakikada başarıyla tamamlandı.`,
      },
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('Log workout error:', error);
    return NextResponse.json(
      { error: 'Antrenman kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}
