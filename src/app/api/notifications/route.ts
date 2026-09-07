import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const whereClause: any = {
      gymId: context.gymId,
    };

    if (context.role === 'MEMBER' && context.session.memberId) {
      whereClause.OR = [
        { memberId: context.session.memberId },
        { userId: context.session.userId },
      ];
    } else {
      whereClause.OR = [
        { userId: context.session.userId },
        { userId: null, memberId: null }, // Broadcast
      ];
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json(
      { error: 'Bildirimler yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const { notificationId, markAll = false } = await req.json();

    if (markAll) {
      await prisma.notification.updateMany({
        where: { gymId: context.gymId },
        data: { isRead: true },
      });
    } else if (notificationId) {
      await prisma.notification.update({
        where: { id: notificationId },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json(
      { error: 'Bildirim güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}
