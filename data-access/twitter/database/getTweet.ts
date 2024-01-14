import { sql } from '@vercel/postgres';

type TweetResponse = {
  tweet_id: string;
  created_on: Date;
  message?: string;
  user_name: string;
  user_profile_image: string;
  user_screen_name: string;
  entities?: string;
  parent_tweet_id?: string;
  media_details?: string;
  tweet_time: Date;
  body: string;
  quoted_tweet_id?: string;
  tweet_time_override: boolean;
};

export const getTweets = async () => {
  const { rows } = await sql`SELECT * FROM tweets ORDER BY created_on DESC LIMIT 10`;

  return { tweets: rows as TweetResponse[] };
};
