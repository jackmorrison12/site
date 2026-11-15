export type Place = {
  iata: string;
  name: string;
  city: string;
  /** ISO 3166 alpha-2. */
  country: string;
  lat: number;
  lon: number;
};

/** One flown leg, as the map needs it. Canceled and upcoming flights never get here. */
export type FlownLeg = {
  departureDate: string;
  carrier: string | null;
  flightNumber: string | null;
  from: Place;
  /** Where it actually landed: the diversion airport if there was one. */
  to: Place;
};

export type Route = { from: Place; to: Place; count: number };

export type VisitedPlace = Place & { visits: number; lastVisit: string };

export type Travel = {
  flights: number;
  distanceKm: number;
  countries: string[];
  cities: number;
  firstYear: number | null;
  routes: Route[];
  places: VisitedPlace[];
  lastFlight: FlownLeg | null;
  /** Flights per calendar year, oldest first. */
  byYear: { year: number; flights: number }[];
};

export type WatchedShow = {
  title: string;
  episodes: number;
  lastWatched: string;
  /** The latest episode watched, e.g. S2E5. */
  latest: string | null;
};

export type Watch = {
  type: 'movie' | 'episode';
  title: string;
  showTitle: string | null;
  episode: string | null;
  /** ISO time: the page data is cached as JSON, so no Date objects. */
  watchedAt: string;
};

export type Watching = {
  last: Watch | null;
  /** Shows watched in the last 30 days, most recent first. */
  shows: WatchedShow[];
  recentMovies: Watch[];
  last30: { episodes: number; movies: number };
  thisYear: { episodes: number; movies: number };
};

export type Listening = {
  last30: { listens: number; artists: number; tracks: number };
  topArtists: { artist: string; count: number; imageUrl: string | null }[];
  topTracks: { name: string; artist: string; count: number; imageUrl: string | null }[];
};

export type NowData = {
  listening: Listening | null;
  watching: Watching | null;
  travel: Travel | null;
};
