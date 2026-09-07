import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Active currently inside: checkIn today with null checkOutTime
    const currentlyInside = await prisma.checkIn.findMany({
      where: {
        gymId: context.gymId,
        checkInTime: { gte: todayStart },
        checkOutTime: null,
      },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            memberCode: true,
            status: true,
            membershipEnd: true,
          },
        },
      },
      orderBy: { checkInTime: 'desc' },
    });

    // Total check-ins today
    const todayTotal = await prisma.checkIn.count({
      where: {
        gymId: context.gymId,
        checkInTime: { gte: todayStart },
      },
    });

    // Recent 20 check-in logs
    const recentLogs = await prisma.checkIn.findMany({
      where: { gymId: context.gymId },
      include: {
        member: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            memberCode: true,
            status: true,
            membershipEnd: true,
          },
        },
      },
      orderBy: { checkInTime: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      success: true,
      activeCount: currentlyInside.length,
      todayTotal,
      currentlyInside,
      recentLogs,
    });
  } catch (error) {
    console.error('Fetch check-in status error:', error);
    return NextResponse.json(
      { error: 'Giriş-çıkış verileri alınırken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const { memberCode, method = 'QR_CODE' } = await req.json();

    if (!memberCode) {
      return NextResponse.json(
        { error: 'Lütfen müşteri kodu veya QR okutun.' },
        { status: 400 }
      );
    }

    const cleanCode = memberCode.trim().toUpperCase();

    // Multi-tenant member lookup
    const member = await prisma.member.findFirst({
      where: {
        gymId: context.gymId,
        memberCode: cleanCode,
      },
    });

    if (!member) {
      return NextResponse.json(
        { error: 'Bu koda ait üye bu spor salonunda bulunamadı.' },
        { status: 404 }
      );
    }

    const isMembershipExpired = new Date(member.membershipEnd) < new Date();
    const isSuspended = member.status === 'FROZEN';

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Check if currently checked in without checkout
    const activeCheckIn = await prisma.checkIn.findFirst({
      where: {
        gymId: context.gymId,
        memberId: member.id,
        checkInTime: { gte: todayStart },
        checkOutTime: null,
      },
    });

    let actionType = 'CHECK_IN';
    let record;

    if (activeCheckIn) {
      // Check out member
      record = await prisma.checkIn.update({
        where: { id: activeCheckIn.id },
        data: { checkOutTime: new Date() },
      });
      actionType = 'CHECK_OUT';

      await prisma.timelineEvent.create({
        data: {
          gymId: context.gymId,
          memberId: member.id,
          type: 'CHECK_OUT',
          title: 'Salondan Çıkış Yapıldı',
          description: `Turnike çıkışı kaydedildi (${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}).`,
        },
      });
    } else {
      // Create new check-in
      record = await prisma.checkIn.create({
        data: {
          gymId: context.gymId,
          memberId: member.id,
          checkInTime: new Date(),
          method,
        },
      });

      await prisma.timelineEvent.create({
        data: {
          gymId: context.gymId,
          memberId: member.id,
          type: 'CHECK_IN',
          title: 'Salona Giriş Yapıldı',
          description: `Turnike girişi kaydedildi (${new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}).`,
        },
      });
    }

    // Recalculate active inside count
    const activeCount = await prisma.checkIn.count({
      where: {
        gymId: context.gymId,
        checkInTime: { gte: todayStart },
        checkOutTime: null,
      },
    });

    return NextResponse.json({
      success: true,
      action: actionType,
      member: {
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
        memberCode: member.memberCode,
        status: member.status,
        membershipEnd: member.membershipEnd,
        isExpired: isMembershipExpired,
        isSuspended,
      },
      record,
      activeCount,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Giriş-çıkış işlemi sırasında bir hata oluştu.' },
      { status: 500 }
    );
  }
}
