import 'drizzle/envConfig';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url:
      process.env.POSTGRES_URL ??
      'postgres://default:d8ZmBa2MpLrO@ep-still-snowflake-98407531-pooler.eu-central-1.postgres.vercel-storage.com/verceldb',
  },
});
