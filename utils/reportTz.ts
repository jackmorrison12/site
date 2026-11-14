export type ReportTz = 'America/New_York' | 'Europe/London';

/**
 * I lived in London until March 2024; from 2024 onwards in NY. Stats are bucketed
 * in whichever timezone I was actually living in, so "my 2am month" means 2am to me.
 */
export function reportTzForDate(date: Date): ReportTz {
  return date.getUTCFullYear() >= 2024 ? 'America/New_York' : 'Europe/London';
}

/** The timezone a whole calendar year is reported in. */
export function reportTz(year: number): ReportTz {
  return reportTzForDate(new Date(Date.UTC(year, 0, 1)));
}

/** Hours to add to a local wall-clock time to get UTC, on Jan 1 (always standard time). */
export function januaryUtcOffset(tz: ReportTz): number {
  return tz === 'America/New_York' ? 5 : 0;
}
