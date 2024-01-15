'use client';

import { addTweet } from 'data-access/twitter/api/addTweet';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { useMutation } from 'react-query';

export default function Page() {
  const session = useSession();

  const [tweetId, setTweetId] = useState<string | undefined>(undefined);
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [quotedTweetId, setQuotedTweetId] = useState<string | undefined>(undefined);
  const [tweetTimeOverride, setTweetTimeOverride] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: async (tweetId: string) => {
      const res = await addTweet({ tweetId, message, quotedTweetId, tweetTimeOverride });
      console.log('res');
      console.log(res);
      console.log('error' in res);
      if ('error' in res) {
        throw new Error(res.error);
      }
      return res;
    },
  });

  if (session.data?.user?.email !== 'jack1morrison@sky.com') {
    return <button onClick={() => signIn('github')}>Sign in</button>;
  }

  return (
    <>
      <h1>Admin Dashboard</h1>
      <button onClick={() => signOut()}>Sign out</button>
      <h2>Add a Tweet</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '20% 40%', gap: '20px' }}>
        <label id="tweetId">Tweet ID/URL</label>
        <input name="tweetId" placeholder="Tweet ID/URL" value={tweetId} onChange={(e) => setTweetId(e.target.value)} />
        <label id="message">Message (optional)</label>
        <input name="message" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <label id="quoteTweetIdUrl">Quote tweet ID/URL (optional)</label>
        <input
          name="quoteTweetIdUrl"
          placeholder="Quote tweet ID/URL"
          value={quotedTweetId}
          onChange={(e) => setQuotedTweetId(e.target.value)}
        />
        <label id="tweetTimeOverride">Use Tweet time rather than time added</label>
        <input
          name="tweetTimeOverride"
          type="checkbox"
          checked={tweetTimeOverride}
          onChange={() => setTweetTimeOverride((prev) => !prev)}
        />
        <button
          disabled={!tweetId}
          onClick={() => {
            const res = mutation.mutate(tweetId ?? 'test');
            console.log(res);
          }}
        >
          Add
        </button>
        {mutation.status}
        {mutation.isLoading ? 'loading' : JSON.stringify(mutation.data)}
        {mutation.isError && (mutation.error as Error).message}
      </div>
    </>
  );
}
