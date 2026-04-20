'use client';

export function LocalTime({ date }: { date: Date }) {
  return (
    <>
      {date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} @{' '}
      {date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
    </>
  );
}
