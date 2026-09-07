import { redirect } from 'next/navigation';
import { getCurrentUserWithGym } from '@/lib/auth';
import MemberHeader from '@/components/MemberHeader';
import MemberBottomNav from '@/components/MemberBottomNav';
import { prisma } from '@/lib/prisma';

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserWithGym();

  if (!user) {
    redirect('/login');
  }

  let member = user.memberProfile;
  // If gym admin or trainer viewing member section, fallback to first member in this gym
  if (!member && user.gymId) {
    member = (await prisma.member.findFirst({
      where: { gymId: user.gymId },
      include: { trainer: { include: { user: true } } },
    })) as any;
  }

  const gym = user.gym;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col antialiased">
      {/* Centered Mobile-First Frame */}
      <div className="w-full max-w-md md:max-w-xl mx-auto min-h-screen bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col relative pb-20">
        <MemberHeader
          gymName={gym?.name || 'FitZone Club'}
          gymLogo={gym?.logo}
          memberName={member ? `${member.firstName} ${member.lastName}` : user.name}
          memberCode={member?.memberCode || 'GYM-PREVIEW'}
        />

        <main className="flex-1 p-4 md:p-5 overflow-y-auto">
          {children}
        </main>

        <MemberBottomNav primaryColor={gym?.primaryColor || '#2563eb'} />
      </div>
    </div>
  );
}
