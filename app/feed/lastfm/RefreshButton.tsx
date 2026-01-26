'use client';

import { updateLastFmData } from 'app/api/updateLastFmData/updateLastFmData';
import { signOut, useSession } from 'next-auth/react';
import { ChangeEvent, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

export const RefreshButton = () => {
  const session = useSession();

  const mutation = useMutation({
    mutationFn: async ({ days }: { days: number | undefined }) => {
      const res = await updateLastFmData({ days });
      return res;
    },
  });

  const text = mutation.isPending
    ? 'Loading...'
    : mutation.isError
    ? 'Error refreshing'
    : mutation.isSuccess
    ? `Refreshed ${mutation.data.total} songs`
    : 'Refresh';

  const [days, setDays] = useState<number | undefined>(undefined);

  if (session.data?.user?.email !== 'jack1morrison@sky.com') {
    return null;
  }

  return (
    <>
      <button disabled={mutation.isSuccess || mutation.isError} onClick={() => mutation.mutate({ days })}>
        {text}
      </button>
      <input
        type="number"
        value={days}
        pattern="[0-9]{0,5}"
        onInput={(event: ChangeEvent<HTMLInputElement>) => setDays(parseInt(event.target.value))}
      />
      <div>{days}</div>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
};
