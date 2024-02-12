import { sql } from '@vercel/postgres';

const nullify = (value?: string) => (value && value !== 'NULL' ? value : undefined);

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
  show_on_homescreen: boolean;
};

const insertAt = (str: string, sub: string, pos: number) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

export const getTweets = async () => {
  const { rows } = (await sql`SELECT * FROM tweets ORDER BY created_on DESC LIMIT 10`) as { rows: TweetResponse[] };

  const enrichedTweets = rows.map((r) => {
    const hashtags =
      r.entities && nullify(r.entities)
        ? (JSON.parse(r.entities) as { hashtags: Array<{ indices: [number, number]; text: string }> })
        : undefined;

    let enrichedBody = r.body;
    let counter = 0;
    hashtags?.hashtags.forEach((h) => {
      const aTag = `<a href="https://twitter.com/hashtag/${h.text}">`;
      counter += aTag.length;
      enrichedBody = insertAt(enrichedBody, aTag, h.indices[0] + (counter - aTag.length));
      enrichedBody = insertAt(enrichedBody, '</a>', h.indices[1] + counter);
      counter += 4;
    });

    const images =
      r.media_details && nullify(r.media_details)
        ? (JSON.parse(r.media_details) as Array<{ media_url_https: string; type: string }>)
            .filter((m) => m.type === 'photo')
            .map((i) => i.media_url_https)
        : undefined;
    return { ...r, images, hashtags, enrichedBody, message: nullify(r.message) };
  });

  return { tweets: enrichedTweets };
};
