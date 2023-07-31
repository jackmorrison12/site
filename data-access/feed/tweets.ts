import { sql } from '@vercel/postgres';

export const getTweets = async () => {
  const { rows } = await sql`SELECT * FROM tweets ORDER BY created_on DESC LIMIT 10`;

  return { tweets: rows };
};

export const addTweet = async ({ id, message }: { id: string; message?: string }) =>
  await sql`INSERT INTO tweets VALUES (${id}, NOW(), ${message ?? 'NULL'})`;
