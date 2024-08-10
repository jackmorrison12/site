import { db } from 'drizzle/db';
import { tweets } from 'drizzle/schema';

export const insertTweet = async ({
  id,
  message,
  tweetTime,
  tweetBody,
  userName,
  userProfileImage,
  userScreenName,
  entities,
  parentTweetId,
  mediaDetails,
  quotedTweetId,
  tweetTimeOverride,
  showOnHomescreen,
}: {
  id: string;
  message?: string;
  tweetTime: Date;
  tweetBody: string;
  userName: string;
  userProfileImage: string;
  userScreenName: string;
  entities?: string;
  parentTweetId?: string;
  mediaDetails?: string;
  quotedTweetId?: string;
  tweetTimeOverride?: boolean;
  showOnHomescreen?: boolean;
}) =>
  await db.insert(tweets).values({
    tweetId: BigInt(id),
    createdOn: new Date(),
    message,
    userName,
    userProfileImage,
    userScreenName,
    entities,
    parentTweetId,
    mediaDetails,
    tweetTime,
    body: tweetBody,
    quotedTweetId,
    tweetTimeOverride,
    showOnHomescreen,
  });
