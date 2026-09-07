import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET() {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  try {
    const gym = await prisma.gym.findUnique({
      where: { id: context.gymId },
    });

    return NextResponse.json({ success: true, gym });
  } catch (error) {
    console.error('Fetch gym settings error:', error);
    return NextResponse.json(
      { error: 'Ayarlar yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.role !== 'GYM_ADMIN' && context.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Bu ayarları yalnızca salon yöneticisi değiştirebilir.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      name,
      logo,
      primaryColor,
      accentColor,
      phone,
      email,
      address,
      action, // 'ACTIVATE_SUBSCRIPTION'
    } = body;

    // Special action: activate / renew subscription
    if (action === 'ACTIVATE_SUBSCRIPTION') {
      const now = new Date();
      const updatedGym = await prisma.gym.update({
        where: { id: context.gymId },
        data: {
          subscriptionStatus: 'ACTIVE',
          trialEndsAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000), // 1 Year Pro
        },
      });

      await prisma.notification.create({
        data: {
          gymId: context.gymId,
          userId: context.session.userId,
          title: 'Hesabınız Başarıyla Aktifleştirildi! 🎉',
          message: 'FitPulse Pro üyeliğiniz 1 yıl süreyle yenilendi. Tüm sınırlamalar kaldırıldı.',
          type: 'SYSTEM',
        },
      });

      return NextResponse.json({ success: true, gym: updatedGym });
    }

    const dataToUpdate: any = {};
    if (name) dataToUpdate.name = name.trim();
    if (logo !== undefined) dataToUpdate.logo = logo ? logo.trim() : null;
    if (primaryColor) dataToUpdate.primaryColor = primaryColor.trim();
    if (accentColor) dataToUpdate.accentColor = accentColor.trim();
    if (phone !== undefined) dataToUpdate.phone = phone ? phone.trim() : null;
    if (email) dataToUpdate.email = email.trim();
    if (address !== undefined) dataToUpdate.address = address ? address.trim() : null;

    const gym = await prisma.gym.update({
      where: { id: context.gymId },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, gym });
  } catch (error) {
    console.error('Update gym settings error:', error);
    return NextResponse.json(
      { error: 'Ayarlar güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}
