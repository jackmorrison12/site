import { sql } from '@vercel/postgres';

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
}) =>
  await sql`INSERT INTO tweets 
  (tweet_id, created_on, message, user_name, user_profile_image, user_screen_name, entities, parent_tweet_id, media_details, tweet_time, body, quoted_tweet_id, tweet_time_override) 
  VALUES (${id}, NOW(), ${message ?? 'NULL'}, ${userName}, ${userProfileImage}, ${userScreenName}, ${
    entities ?? 'NULL'
  }, ${parentTweetId ?? 'NULL'}, ${
    mediaDetails ?? 'NULL'
  }, to_timestamp(${tweetTime.valueOf()} / 1000.0), ${tweetBody} , ${quotedTweetId ?? 'NULL'}, ${
    tweetTimeOverride ?? false
  })`;
