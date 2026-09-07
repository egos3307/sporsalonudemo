import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTenantContext } from '@/lib/tenant';

export async function GET(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  const { searchParams } = new URL(req.url);
  let memberId = searchParams.get('memberId');

  if (context.role === 'MEMBER') {
    memberId = context.session.memberId || null;
  }

  if (!memberId) {
    return NextResponse.json({ error: 'Üye kimliği belirtilmelidir.' }, { status: 400 });
  }

  try {
    const measurements = await prisma.measurement.findMany({
      where: {
        gymId: context.gymId,
        memberId,
      },
      orderBy: { date: 'asc' }, // Chronological for charts
    });

    return NextResponse.json({ success: true, measurements });
  } catch (error) {
    console.error('Fetch measurements error:', error);
    return NextResponse.json(
      { error: 'Ölçümler yüklenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const context = await getTenantContext();
  if (context instanceof NextResponse) return context;

  if (context.isExpired) {
    return NextResponse.json(
      { error: 'Deneme süreniz doldu. Yeni ölçüm eklemek için hesabınızı aktifleştirin.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const {
      weight,
      height,
      bodyFat,
      muscleMass,
      waist,
      chest,
      arm,
      leg,
      shoulder,
      notes,
    } = body;
    let memberId = body.memberId;

    if (context.role === 'MEMBER') {
      memberId = context.session.memberId;
    }

    if (!memberId || !weight) {
      return NextResponse.json(
        { error: 'Lütfen en azından kilo değerini belirtin.' },
        { status: 400 }
      );
    }

    const member = await prisma.member.findFirst({
      where: { id: memberId, gymId: context.gymId },
    });

    if (!member) {
      return NextResponse.json({ error: 'Üye bulunamadı.' }, { status: 404 });
    }

    const measurement = await prisma.measurement.create({
      data: {
        gymId: context.gymId,
        memberId,
        date: new Date(),
        weight: Number(weight),
        height: height ? Number(height) : null,
        bodyFat: bodyFat ? Number(bodyFat) : null,
        muscleMass: muscleMass ? Number(muscleMass) : null,
        waist: waist ? Number(waist) : null,
        chest: chest ? Number(chest) : null,
        arm: arm ? Number(arm) : null,
        leg: leg ? Number(leg) : null,
        shoulder: shoulder ? Number(shoulder) : null,
        notes: notes?.trim() || null,
      },
    });

    await prisma.timelineEvent.create({
      data: {
        gymId: context.gymId,
        memberId,
        type: 'MEASUREMENT',
        title: 'Yeni Vücut Ölçümü Girildi',
        description: `Kilo: ${weight} kg${bodyFat ? `, Yağ Oranı: %${bodyFat}` : ''}${arm ? `, Kol: ${arm} cm` : ''}.`,
      },
    });

    return NextResponse.json({ success: true, measurement });
  } catch (error) {
    console.error('Create measurement error:', error);
    return NextResponse.json(
      { error: 'Ölçüm kaydedilirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
