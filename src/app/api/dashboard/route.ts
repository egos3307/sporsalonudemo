import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const gymId = context.gymId;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // 1. Core KPIs
    const [
      totalMembers,
      activeMembers,
      checkInsToday,
      activeTrainers,
      expiringMembers,
      todayWorkoutsCount,
      currentlyInsideCount,
      gym,
    ] = await Promise.all([
      prisma.member.count({ where: { gymId } }),
      prisma.member.count({ where: { gymId, status: 'ACTIVE' } }),
      prisma.checkIn.count({ where: { gymId, checkInTime: { gte: todayStart } } }),
      prisma.trainer.count({ where: { gymId, isActive: true } }),
      prisma.member.count({
        where: {
          gymId,
          membershipEnd: { gte: now, lte: next7Days },
          status: 'ACTIVE',
        },
      }),
      prisma.workoutPlan.count({ where: { gymId, isActive: true } }),
      prisma.checkIn.count({
        where: { gymId, checkInTime: { gte: todayStart }, checkOutTime: null },
      }),
      prisma.gym.findUnique({ where: { id: gymId } }),
    ]);

    // 2. Status Distribution (for Donut/Pie Chart)
    const [frozenMembers, expiredMembers, pendingMembers] = await Promise.all([
      prisma.member.count({ where: { gymId, status: 'FROZEN' } }),
      prisma.member.count({ where: { gymId, status: 'EXPIRED' } }),
      prisma.member.count({ where: { gymId, status: 'PENDING_ACTIVATION' } }),
    ]);

    const statusDistribution = [
      { name: 'Aktif', value: activeMembers, color: '#10b981' },
      { name: 'Dondurulmuş', value: frozenMembers, color: '#f59e0b' },
      { name: 'Süresi Dolan', value: expiredMembers, color: '#ef4444' },
      { name: 'Aktivasyon Bekleyen', value: pendingMembers, color: '#6366f1' },
    ];

    // 3. Weekly Check-In Trends (Last 7 Days)
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'];
    const weeklyCheckIns = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const start = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
      const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

      const count = await prisma.checkIn.count({
        where: {
          gymId,
          checkInTime: { gte: start, lt: end },
        },
      });

      weeklyCheckIns.push({
        day: dayNames[start.getDay()],
        tarih: `${start.getDate()}/${start.getMonth() + 1}`,
        girisler: count,
      });
    }

    // 4. Monthly Registrations (Last 6 Months)
    const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
    const monthlyRegistrations = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - m + 1, 1);

      const count = await prisma.member.count({
        where: {
          gymId,
          createdAt: { gte: d, lt: nextMonth },
        },
      });

      monthlyRegistrations.push({
        ay: monthNames[d.getMonth()],
        kayit: count,
      });
    }

    // 5. Recent Activity Feed (Check-ins, Workouts, Measurements, etc.)
    const recentEvents = await prisma.timelineEvent.findMany({
      where: { gymId },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            memberCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    // 6. Trial Remaining Days Calculation
    let remainingTrialDays = 0;
    if (gym) {
      const diffMs = new Date(gym.trialEndsAt).getTime() - now.getTime();
      remainingTrialDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    }

    return NextResponse.json({
      success: true,
      gym,
      remainingTrialDays,
      isExpired: context.isExpired,
      kpis: {
        totalMembers,
        activeMembers,
        checkInsToday,
        activeTrainers,
        expiringMembers,
        todayWorkoutsCount,
        currentlyInsideCount,
      },
      statusDistribution,
      weeklyCheckIns,
      monthlyRegistrations,
      recentEvents,
    });
  } catch (error) {
    console.error('Fetch dashboard error:', error);
    return NextResponse.json(
      { error: 'Dashboard verileri alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
