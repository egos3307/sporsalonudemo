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

    const diets = await prisma.dietPlan.findMany({
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
        meals: {
          include: {
            items: true,
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, diets });
  } catch (error) {
    console.error('Fetch diets error:', error);
    return NextResponse.json(
      { error: 'Diyet planları yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.isExpired) {
    return NextResponse.json(
      { error: 'Deneme süreniz doldu. Yeni diyet programı oluşturmak için lütfen hesabınızı aktifleştirin.' },
      { status: 403 }
    );
  }

  if (context.role === 'MEMBER') {
    return NextResponse.json(
      { error: 'Üyeler yeni diyet programı oluşturamaz.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      memberId,
      title,
      targetCalories = 2200,
      targetProtein = 150,
      targetCarbs = 220,
      targetFat = 65,
      meals = [],
    } = body;

    if (!memberId || !title || !Array.isArray(meals) || meals.length === 0) {
      return NextResponse.json(
        { error: 'Lütfen üye, program başlığı ve en az bir öğün ekleyin.' },
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

    // Deactivate previous plans for this member
    await prisma.dietPlan.updateMany({
      where: { memberId, gymId: context.gymId, isActive: true },
      data: { isActive: false },
    });

    const newDiet = await prisma.dietPlan.create({
      data: {
        gymId: context.gymId,
        memberId,
        trainerId,
        title: title.trim(),
        targetCalories: Number(targetCalories) || 2200,
        targetProtein: Number(targetProtein) || 150,
        targetCarbs: Number(targetCarbs) || 220,
        targetFat: Number(targetFat) || 65,
        isActive: true,
        meals: {
          create: meals.map((meal: any, mIdx: number) => ({
            name: meal.name || `Öğün ${mIdx + 1}`,
            time: meal.time || null,
            order: mIdx + 1,
            items: {
              create: (meal.items || []).map((item: any) => ({
                food: item.food,
                amount: item.amount,
                calories: Number(item.calories) || 0,
                protein: Number(item.protein) || 0,
                carbs: Number(item.carbs) || 0,
                fat: Number(item.fat) || 0,
              })),
            },
          })),
        },
      },
      include: {
        meals: {
          include: { items: true },
        },
      },
    });

    // Record timeline event
    await prisma.timelineEvent.create({
      data: {
        gymId: context.gymId,
        memberId,
        type: 'DIET_ASSIGNED',
        title: 'Yeni Beslenme Programı Tanımlandı',
        description: `"${title}" adlı beslenme planı (${targetCalories} kcal) oluşturuldu.`,
      },
    });

    // Notification
    await prisma.notification.create({
      data: {
        gymId: context.gymId,
        memberId,
        title: 'Beslenme Programınız Güncellendi 🥗',
        message: `"${title}" adlı yeni diyet listeniz profilinize eklendi.`,
        type: 'DIET',
      },
    });

    return NextResponse.json({ success: true, diet: newDiet });
  } catch (error) {
    console.error('Create diet plan error:', error);
    return NextResponse.json(
      { error: 'Diyet planı oluşturulurken hata oluştu.' },
      { status: 500 }
    );
  }
}
