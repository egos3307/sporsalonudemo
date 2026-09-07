import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gym_saas_super_secret_jwt_key_99812_secure_token'
);

export const COOKIE_NAME = 'gym_session_token';

export interface SessionPayload {
  userId: string;
  gymId: string | null;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'GYM_ADMIN' | 'TRAINER' | 'MEMBER';
  memberId?: string | null;
  trainerId?: string | null;
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}

export async function getCurrentUserWithGym() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      gym: true,
      trainerProfile: true,
      memberProfile: {
        include: {
          trainer: {
            include: { user: true }
          }
        }
      },
    },
  });

  if (!user) return null;

  return {
    ...user,
    session,
  };
}
