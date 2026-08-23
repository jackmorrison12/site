import 'server-only';

import { sql } from 'drizzle-orm';
import { db } from 'drizzle/db';

/**
 * The GitHub and Trakt tables are owned by pulsar and may not exist yet. Probing
 * once is cheaper and clearer than catching error 42P01 on every query.
 */
export async function tableExists(name: string): Promise<boolean> {
  try {
    const res = await db.execute(sql`SELECT to_regclass(${`public.${name}`}) AS reg`);
    return Boolean((res.rows[0] as { reg: string | null } | undefined)?.reg);
  } catch {
    return false;
  }
}
