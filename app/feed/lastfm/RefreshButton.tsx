'use client';

import { updateLastFmData } from 'app/api/updateLastFmData/updateLastFmData';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';

export const RefreshButton = () => {
  const mutation = useMutation({
    mutationFn: async ({ days }: { days: number | undefined }) => {
      const res = await updateLastFmData({ days });
      return res;
    },
  });

  const text = mutation.isLoading
    ? 'Loading...'
    : mutation.isError
    ? 'Error refreshing'
    : mutation.isSuccess
    ? `Refreshed ${mutation.data.total} songs`
    : 'Refresh';

  const [days, setDays] = useState<number | undefined>(undefined);

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
    </>
  );
};
