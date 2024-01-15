'use server';
import { auth } from 'auth';
import { insertTweet } from 'data-access/twitter/database/addTweet';
import { z } from 'zod';

const tweetResponseSchema = z.object({
  created_at: z.string().pipe(z.coerce.date()),
  id_str: z.string(),
  text: z.string(),
  user: z.object({ name: z.string(), profile_image_url_https: z.string().url(), screen_name: z.string() }),
  entities: z.object({
    hashtags: z.array(z.object({ indices: z.array(z.number()), text: z.string() })),
    urls: z.array(z.object({ display_url: z.string(), expanded_url: z.string().url(), indices: z.array(z.number()) })),
    user_mentions: z.array(
      z.object({ id_str: z.string(), indices: z.array(z.number()), name: z.string(), screen_name: z.string() }),
    ),
  }),
  parent: z.object({ in_reply_to_status_id_str: z.string() }).optional(),
  mediaDetails: z
    .array(
      z.object({
        media_url_https: z.string().url(),
        type: z.literal('photo').or(z.literal('video')),
        video_info: z
          .object({
            variants: z.array(
              z.object({ bitrate: z.number().optional(), content_type: z.string(), url: z.string().url() }),
            ),
          })
          .optional(),
      }),
    )
    .optional(),
});

const getToken = (id: string) => ((Number(id) / 1e15) * Math.PI).toString(6 ** 2).replace(/(0+|\.)/g, '');

const getTweetInfo = async (tweetId: string) => {
  const tweetData = await fetch(
    `https://cdn.syndication.twimg.com/tweet-result?id=${tweetId}&token=${getToken(tweetId)}`,
  );

  if (tweetData.status !== 200) {
    return { error: `Tweet ID invalid: ${tweetId}` };
  }
  const resp = await tweetData.json();
  try {
    return tweetResponseSchema.parse(resp);
  } catch {
    console.log(resp);
    return { error: `Twitter API response failed to parse for ID: ${tweetId}` };
  }
};

export async function addTweet({
  tweetId,
  quotedTweetId,
  message,
  tweetTimeOverride,
}: {
  tweetId: string;
  quotedTweetId?: string;
  message?: string;
  tweetTimeOverride?: boolean;
}) {
  const res = await auth();
  if (res?.user?.email !== 'jack1morrison@sky.com') {
    return { error: 'You are not permissioned to do this. Your details have been noted', details: res?.user };
  }

  const tweetData = await getTweetInfo(tweetId);
  let quotedTweetData = undefined;
  if (quotedTweetId) {
    quotedTweetData = await getTweetInfo(quotedTweetId);
  }

  if ('error' in tweetData || (quotedTweetData && 'error' in quotedTweetData)) {
    return { error: 'Error fetching tweet info', tweetData, quotedTweetData };
  }

  const originalResult = await insertTweet({
    id: tweetData.id_str,
    message,
    tweetTime: tweetData.created_at,
    tweetBody: tweetData.text,
    userName: tweetData.user.name,
    userProfileImage: tweetData.user.profile_image_url_https,
    userScreenName: tweetData.user.screen_name,
    entities: JSON.stringify(tweetData.entities),
    parentTweetId: tweetData.parent?.in_reply_to_status_id_str,
    mediaDetails: JSON.stringify(tweetData.mediaDetails),
    quotedTweetId,
    tweetTimeOverride,
  });

  let quotedResult = undefined;

  if (quotedTweetData) {
    quotedResult = await insertTweet({
      id: quotedTweetData.id_str,
      tweetTime: quotedTweetData.created_at,
      tweetBody: quotedTweetData.text,
      userName: quotedTweetData.user.name,
      userProfileImage: quotedTweetData.user.profile_image_url_https,
      userScreenName: quotedTweetData.user.screen_name,
      entities: JSON.stringify(quotedTweetData.entities),
      parentTweetId: quotedTweetData.parent?.in_reply_to_status_id_str,
      mediaDetails: JSON.stringify(quotedTweetData.mediaDetails),
    });
  }

  return { originalResult, quotedResult };
}
