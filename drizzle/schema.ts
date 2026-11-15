import {
  timestamp,
  pgTable,
  text,
  bigserial,
  bigint,
  varchar,
  boolean,
  primaryKey,
  date,
  doublePrecision,
  integer,
} from 'drizzle-orm/pg-core';

export const tweets = pgTable('tweets', {
  tweetId: bigserial('tweet_id', { mode: 'bigint' }).primaryKey().notNull(),
  createdOn: timestamp('created_on', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  message: varchar('message'),
  userName: text('user_name').notNull(),
  userProfileImage: text('user_profile_image').notNull(),
  userScreenName: text('user_screen_name').notNull(),
  entities: text('entities'),
  parentTweetId: text('parent_tweet_id'),
  mediaDetails: text('media_details'),
  tweetTime: timestamp('tweet_time', { mode: 'date' }).notNull(),
  body: text('body').notNull(),
  quotedTweetId: text('quoted_tweet_id'),
  tweetTimeOverride: boolean('tweet_time_override').default(false),
  showOnHomescreen: boolean('show_on_homescreen').default(false),
});

export const tracks = pgTable('tracks', {
  id: text('id').primaryKey().notNull(),
  mbid: text('backup_id'),
  name: text('name').notNull(),
  artist: text('artist').notNull(),
  album: text('album').notNull(),
  imageUrl: text('image_url'),
});

export const listens = pgTable(
  'listens',
  {
    time: timestamp('time', { withTimezone: true, mode: 'date' }).notNull(),
    id: text('id').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.time, table.id] }),
  }),
);

// The tables below are owned by pulsar (pulsar/src/db/remote-schema.ts is the
// source of truth, and carries the migrations). They are mirrored here read-only
// so queries are typed; they may not exist yet, so probe with tableExists first.

/** Flights that have landed. Pulsar never writes upcoming flights, PNRs, seats or tail numbers. */
export const flights = pgTable('flights', {
  id: text('id').primaryKey().notNull(),
  // Local date at the origin airport.
  departureDate: date('departure_date', { mode: 'string' }).notNull(),
  carrier: text('carrier'),
  flightNumber: text('flight_number'),
  fromIata: text('from_iata').notNull(),
  toIata: text('to_iata').notNull(),
  departsAt: timestamp('departs_at', { withTimezone: true, mode: 'date' }).notNull(),
  arrivesAt: timestamp('arrives_at', { withTimezone: true, mode: 'date' }),
  aircraft: text('aircraft'),
  canceled: boolean('canceled').notNull(),
  divertedTo: text('diverted_to'),
  source: text('source', { enum: ['flighty-export', 'calendar'] }).notNull(),
});

/** Every airport `flights` touches. `country` is ISO 3166 alpha-2. */
export const airports = pgTable('airports', {
  iata: text('iata').primaryKey().notNull(),
  name: text('name').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  lat: doublePrecision('lat').notNull(),
  lon: doublePrecision('lon').notNull(),
  tz: text('tz').notNull(),
});

/** Trakt watch history, one row per watch. */
export const traktHistory = pgTable('trakt_history', {
  id: bigint('id', { mode: 'number' }).primaryKey().notNull(),
  watchedAt: timestamp('watched_at', { withTimezone: true, mode: 'date' }).notNull(),
  action: text('action').notNull(),
  type: text('type').notNull(),
  title: text('title').notNull(),
  showTitle: text('show_title'),
  season: integer('season'),
  number: integer('number'),
  traktId: integer('trakt_id').notNull(),
  slug: text('slug'),
  imdb: text('imdb'),
});
