'use client';

import { updateLastFmData } from 'app/api/updateLastFmData/updateLastFmData';
import { useMutation } from 'react-query';

export const RefreshButton = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const res = await updateLastFmData();
      return res;
    },
  });

  const text = mutation.isLoading
    ? 'Loading...'
    : mutation.isError
    ? 'Error refreshing'
    : mutation.isSuccess
    ? 'Refreshed'
    : 'Refresh';

  return (
    <button disabled={mutation.isSuccess || mutation.isError} onClick={() => mutation.mutate()}>
      {text}
    </button>
  );
};
