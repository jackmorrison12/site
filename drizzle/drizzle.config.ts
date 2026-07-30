import 'drizzle/envConfig';
import { defineConfig } from 'drizzle-kit';

const url = process.env.POSTGRES_URL;

if (!url) {
  throw new Error(
    'POSTGRES_URL is not set. Drizzle Kit needs a connection string — pull it with `vercel env pull .env.local` or export it before running drizzle-kit.',
  );
}

export default defineConfig({
  schema: './drizzle/schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url },
});
