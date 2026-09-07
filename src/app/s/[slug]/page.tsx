import { redirect } from 'next/navigation';

export default function ShortGymRedirect({ params }: { params: { slug: string } }) {
  redirect(`/salon/${params.slug}`);
}
