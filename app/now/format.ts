const TZ = 'America/New_York';

/** "Nov 14", or "Nov 14, 2024" when it isn't this year. */
export function shortDate(iso: string, now = new Date()): string {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
  const year = (d: Date) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric' }).format(d);
  return new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    month: 'short',
    day: 'numeric',
    ...(year(date) === year(now) ? {} : { year: 'numeric' }),
  }).format(date);
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const countryName = (iso2: string) => regionNames.of(iso2) ?? iso2;

/** The flag emoji for an ISO 3166 alpha-2 code. */
export const flag = (iso2: string) =>
  /^[A-Z]{2}$/.test(iso2) ? String.fromCodePoint(...[...iso2].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)) : '';

export const plural = (n: number, word: string, plural = `${word}s`) =>
  `${n.toLocaleString()} ${n === 1 ? word : plural}`;
