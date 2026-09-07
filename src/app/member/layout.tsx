import { redirect } from 'next/navigation';
import { getCurrentUserWithGym } from '@/lib/auth';
import MemberSidebar from '@/components/MemberSidebar';
import MemberTopBar from '@/components/MemberTopBar';
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
  const isStaffPreview = user.role === 'GYM_ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'TRAINER';

  // If gym admin or trainer viewing member section, fallback to first member in this gym
  if (!member && user.gymId) {
    member = (await prisma.member.findFirst({
      where: { gymId: user.gymId },
      include: { trainer: { include: { user: true } } },
    })) as any;
  }

  const gym = user.gym;
  const memberName = member ? `${member.firstName} ${member.lastName}` : user.name;
  const memberCode = member?.memberCode || 'GYM-PREVIEW';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
      {/* Desktop Sidebar */}
      <MemberSidebar
        gymName={gym?.name || 'FitZone Club'}
        gymLogo={gym?.logo}
        memberName={memberName}
        memberCode={memberCode}
        primaryColor={gym?.primaryColor || '#22c55e'}
        isStaffPreview={isStaffPreview}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <MemberTopBar
          gymName={gym?.name || 'FitZone Club'}
          gymLogo={gym?.logo}
          memberName={memberName}
          memberCode={memberCode}
          primaryColor={gym?.primaryColor || '#22c55e'}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <div className="lg:hidden">
          <MemberBottomNav primaryColor={gym?.primaryColor || '#22c55e'} />
        </div>
      </div>
    </div>
  );
}
