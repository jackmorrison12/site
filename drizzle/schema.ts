import { timestamp, pgTable, text, bigserial, varchar, boolean, primaryKey } from 'drizzle-orm/pg-core';

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
