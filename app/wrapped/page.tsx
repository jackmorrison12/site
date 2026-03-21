import { redirect } from 'next/navigation';

export default function Page() {
  const currentYear = new Date().getFullYear();
  redirect(`/wrapped/${currentYear}`);
}
