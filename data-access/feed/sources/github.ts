import 'server-only';

import { sql } from 'drizzle-orm';
import { db } from 'drizzle/db';
import type { GithubMonth } from '../feed.types';
import { tableExists } from './tableExists';
import { attachMockRepos, mockGithubDays, mocksEnabled } from './mock';

type Row = Record<string, unknown>;
const num = (v: unknown) => Number(v ?? 0);

/**
 * Reads the daily contribution counts pulsar backfills from GitHub's contributions
 * GraphQL API. The REST Events API only retains ~90 days, so `github_events` can
 * never carry history — daily counts are the only backfillable grain.
 *
 * Returns an empty map until pulsar creates the table.
 */
export type ContributionDay = { month: string; day: number; count: number; level: number };

/** Roll daily contribution counts up into months. Shared by the real and mock paths. */
export function buildGithubMonths(days: ContributionDay[]): Map<string, GithubMonth> {
  const months = new Map<string, GithubMonth>();

  for (const { month, day, count, level } of days) {
    let m = months.get(month);
    if (!m) {
      m = { contributions: 0, activeDays: 0, longestStreak: 0, levels: [] };
      months.set(month, m);
    }
    m.contributions += count;
    if (count > 0) m.activeDays += 1;
    m.levels[day - 1] = level;
  }

  for (const [key, m] of months) {
    const dayCount = new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)), 0).getDate();
    for (let i = 0; i < dayCount; i += 1) m.levels[i] = m.levels[i] ?? 0;
    m.levels.length = dayCount;

    let run = 0;
    for (const level of m.levels) {
      run = level > 0 ? run + 1 : 0;
      if (run > m.longestStreak) m.longestStreak = run;
    }
  }

  return months;
}

export async function getGithubMonths(): Promise<Map<string, GithubMonth>> {
  if (!(await tableExists('github_contributions'))) {
    if (!mocksEnabled()) return new Map<string, GithubMonth>();
    const mock = buildGithubMonths(mockGithubDays());
    attachMockRepos(mock);
    return mock;
  }

  const res = await db.execute(sql`
    SELECT to_char(date, 'YYYY-MM') AS mon,
           EXTRACT(DAY FROM date) AS d,
           count,
           level
    FROM github_contributions
    ORDER BY date`);

  const months = buildGithubMonths(
    (res.rows as Row[]).map((r) => ({
      month: String(r.mon),
      day: num(r.d),
      count: num(r.count),
      level: num(r.level),
    })),
  );

  await attachRepos(months);
  return months;
}

/** Recent months only — `github_events` is a rolling ~90-day window. */
async function attachRepos(months: Map<string, GithubMonth>) {
  if (!(await tableExists('github_events'))) return;

  const res = await db.execute(sql`
    WITH r AS (
      SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS mon,
             repo_name,
             COUNT(*) AS n,
             ROW_NUMBER() OVER (PARTITION BY date_trunc('month', created_at) ORDER BY COUNT(*) DESC) AS rn,
             COUNT(*) OVER (PARTITION BY date_trunc('month', created_at)) AS repos
      FROM github_events
      GROUP BY 1, 2
    )
    SELECT mon, repo_name, n, repos FROM r WHERE rn = 1`);

  for (const r of res.rows as Row[]) {
    const m = months.get(String(r.mon));
    if (!m) continue;
    m.topRepo = { name: String(r.repo_name), count: num(r.n) };
    m.repos = num(r.repos);
  }
}
