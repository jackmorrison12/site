import { redirect } from 'next/navigation';

export default function Page() {
  const currentYear = parseInt(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric' }).format(new Date()),
    10,
  );
  redirect(`/wrapped/${currentYear}`);
}
