import { desc } from 'drizzle-orm';
import { db } from 'drizzle/db';
import { tweets } from 'drizzle/schema';

const insertAt = (str: string, sub: string, pos: number) => `${str.slice(0, pos)}${sub}${str.slice(pos)}`;

export const getTweets = async () => {
  const rows = await db.query.tweets.findMany({ orderBy: [desc(tweets.createdOn)] });

  const enrichedTweets = rows.map((r) => {
    const hashtags = r.entities
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

    const images = r.mediaDetails
      ? (JSON.parse(r.mediaDetails) as Array<{ media_url_https: string; type: string }>)
          .filter((m) => m.type === 'photo')
          .map((i) => i.media_url_https)
      : undefined;
    return { ...r, images, hashtags, enrichedBody };
  });

  return { tweets: enrichedTweets };
};
