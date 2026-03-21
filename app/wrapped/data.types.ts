export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type SummaryStats = {
  totalListens: number;
  uniqueTracks: number;
  uniqueArtists: number;
};

export type TrackWithCount = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | null;
  count: number;
};

export type ArtistWithCount = {
  artist: string;
  count: number;
};

export type MonthlyTopArtist = {
  month: number;
  monthName: string;
  artist: string;
  count: number;
};

export type WeeklyObsession = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string | null;
  count: number;
  weekDate: Date;
};

export type ListeningPatterns = {
  byDay: { day: number; dayName: string; count: number }[];
  byHour: { hour: number; count: number }[];
};

export type ArtistTrend = {
  artist: string;
  currentCount: number;
  previousCount: number;
  percentChange: number;
};
