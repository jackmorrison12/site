import type { ReportTz } from 'utils/reportTz';

/** A month bucket, formatted 'YYYY-MM'. */
export type MonthKey = string;

export type ArtistRef = { name: string; count: number; imageUrl: string | null };
export type TrackRef = { track: string; artist: string; count: number; imageUrl: string | null };

export type MusicMonth = {
  listens: number;
  artists: number;
  tracks: number;
  topArtist?: ArtistRef;
  /** The single most-played track of the month. */
  obsession?: TrackRef;
  /** Artists heard for the very first time ever this month. */
  discoveries: number;
  discoveryNames: string[];
  peakHour?: { hour: number; count: number };
  busiestDay?: { day: number; count: number };
  /** Listens per day-of-month, index 0 = the 1st. */
  perDay: number[];
  /** The most-listened month in the whole history. */
  isRecord: boolean;
};

export type GithubMonth = {
  contributions: number;
  activeDays: number;
  longestStreak: number;
  /** Per-day contribution level 0-4, index 0 = the 1st. */
  levels: number[];
  topRepo?: { name: string; count: number };
  repos?: number;
};

export type TraktMonth = {
  episodes: number;
  movies: number;
  shows: number;
  topShow?: { title: string; count: number };
  biggestBinge?: { title: string; count: number };
};

export type MonthSummary = {
  key: MonthKey;
  year: number;
  /** 0-11. */
  month: number;
  label: string;
  tz: ReportTz;
  /** The in-progress month — rendered as "so far". */
  isCurrent: boolean;
  /** Among the first months on record, where "new artist" counts are meaningless. */
  isDawn: boolean;
  music?: MusicMonth;
  github?: GithubMonth;
  trakt?: TraktMonth;
};

export type FeedPage = {
  months: MonthSummary[];
  nextCursor: MonthKey | null;
  done: boolean;
};
