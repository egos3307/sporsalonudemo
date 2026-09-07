import { redirect } from 'next/navigation';
import { getCurrentUserWithGym } from '@/lib/auth';
import LeadsClient from './LeadsClient';

export default async function LeadsPage() {
  const user = await getCurrentUserWithGym();

  // Yalnızca platform yöneticisi (SUPER_ADMIN) bu sayfaya erişebilir
  if (!user || user.role !== 'SUPER_ADMIN') {
    redirect('/admin');
  }

  return <LeadsClient />;
}
