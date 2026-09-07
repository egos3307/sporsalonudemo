import { NextResponse } from 'next/server';
import { getSession, SessionPayload } from './auth';
import { prisma } from './prisma';

export interface TenantContext {
  session: SessionPayload;
  gymId: string;
  isExpired: boolean;
  role: 'SUPER_ADMIN' | 'GYM_ADMIN' | 'TRAINER' | 'MEMBER';
}

export async function getTenantContext(): Promise<TenantContext | NextResponse> {
  const session = await getSession();

  if (!session || !session.userId) {
    return NextResponse.json(
      { error: 'Yetkisiz erişim. Lütfen giriş yapın.' },
      { status: 401 }
    );
  }

  if (!session.gymId && session.role !== 'SUPER_ADMIN') {
    return NextResponse.json(
      { error: 'Herhangi bir spor salonu hesabı ile ilişkili değilsiniz.' },
      { status: 403 }
    );
  }

  const gymId = session.gymId!;
  const gym = await prisma.gym.findUnique({
    where: { id: gymId },
  });

  if (!gym) {
    return NextResponse.json(
      { error: 'Spor salonu kaydı bulunamadı.' },
      { status: 404 }
    );
  }

  const isExpired =
    gym.subscriptionStatus === 'EXPIRED' ||
    (gym.subscriptionStatus === 'TRIAL' && gym.trialEndsAt < new Date());

  return {
    session,
    gymId,
    isExpired,
    role: session.role,
  };
}
