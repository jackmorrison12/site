import 'drizzle/envConfig';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

const mockDb = {
  select: () => ({
    from: () => {
      const qb: any = {
        innerJoin: () => qb,
        where: () => qb,
        groupBy: () => qb,
        orderBy: () => qb,
        limit: () => Promise.resolve([]),
        as: () => ({}),
      };
      return qb;
    },
  }),
  query: {
    tweets: {
      findMany: () => Promise.resolve([]),
    },
  },
};

export const db = (process.env.POSTGRES_URL ? drizzle(sql, { schema }) : mockDb) as ReturnType<typeof drizzle<typeof schema>>;
