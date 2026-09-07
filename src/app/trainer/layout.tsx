import { redirect } from 'next/navigation';
import { getCurrentUserWithGym } from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';
import { prisma } from '@/lib/prisma';

export default async function TrainerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserWithGym();

  if (!user) {
    redirect('/login');
  }

  const gym = user.gym;
  const now = new Date();
  let remainingTrialDays = 5;
  let isExpired = false;

  if (gym) {
    const diffMs = new Date(gym.trialEndsAt).getTime() - now.getTime();
    remainingTrialDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    isExpired = gym.subscriptionStatus === 'EXPIRED';
  }

  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const activeOccupancy = gym
    ? await prisma.checkIn.count({
        where: {
          gymId: gym.id,
          checkInTime: { gte: todayStart },
          checkOutTime: null,
        },
      })
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col antialiased">
      <AdminSidebar
        gymName={gym?.name || 'FitZone Club'}
        gymLogo={gym?.logo}
        primaryColor={gym?.primaryColor || '#2563eb'}
        role={user.role}
        isExpired={isExpired}
      />

      <div className="pl-64 flex-1 flex flex-col">
        <AdminHeader
          gymName={gym?.name || 'FitZone Club'}
          userName={user.name}
          remainingTrialDays={remainingTrialDays}
          isExpired={isExpired}
          activeOccupancy={activeOccupancy}
        />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
