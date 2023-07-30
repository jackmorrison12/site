import { sql } from '@vercel/postgres';

export const getTweets = async () => {
  const { rows } = await sql`SELECT * FROM tweets ORDER BY created_on DESC LIMIT 10`;

  return { tweets: rows };
};
