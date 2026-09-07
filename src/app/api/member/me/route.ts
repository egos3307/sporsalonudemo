import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.role !== 'MEMBER' && !context.session.memberId) {
    // If Admin/Trainer checking member view, we can provide the first member as preview
    const firstMember = await prisma.member.findFirst({
      where: { gymId: context.gymId },
    });
    if (!firstMember) {
      return NextResponse.json({ error: 'Üye bulunamadı.' }, { status: 404 });
    }
    context.session.memberId = firstMember.id;
  }

  try {
    const memberId = context.session.memberId!;

    const member = await prisma.member.findUnique({
      where: { id: memberId },
      include: {
        gym: true,
        trainer: {
          include: {
            user: { select: { name: true, avatar: true, phone: true, email: true } },
          },
        },
        workoutPlans: {
          where: { isActive: true },
          include: {
            days: {
              include: {
                exercises: { orderBy: { order: 'asc' } },
              },
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
          take: 7,
        },
        workoutLogs: {
          orderBy: { completedDate: 'desc' },
          take: 5,
        },
        checkIns: {
          orderBy: { checkInTime: 'desc' },
          take: 10,
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!member) {
      return NextResponse.json({ error: 'Üye profili bulunamadı.' }, { status: 404 });
    }

    // Determine today's workout based on day of week
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const currentDayName = dayNames[new Date().getDay()];

    const activePlan = member.workoutPlans[0] || null;
    let todayWorkoutDay = null;
    if (activePlan) {
      todayWorkoutDay =
        activePlan.days.find((d) => d.dayName.toLowerCase() === currentDayName.toLowerCase()) ||
        activePlan.days[0] ||
        null;
    }

    return NextResponse.json({
      success: true,
      member,
      currentDayName,
      todayWorkoutDay,
      activeDietPlan: member.dietPlans[0] || null,
      gymBranding: {
        name: member.gym.name,
        logo: member.gym.logo,
        primaryColor: member.gym.primaryColor,
        accentColor: member.gym.accentColor,
        phone: member.gym.phone,
        address: member.gym.address,
      },
    });
  } catch (error) {
    console.error('Fetch member me error:', error);
    return NextResponse.json(
      { error: 'Üye bilgileri yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}
