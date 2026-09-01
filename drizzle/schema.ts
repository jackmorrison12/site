import { timestamp, pgTable, text, bigserial, varchar, boolean, primaryKey, integer } from 'drizzle-orm/pg-core';
import type { AdapterAccountType } from '@auth/core/adapters';

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

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
});

export const accounts = pgTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
  }),
);

export const sessions = pgTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
});

export const verificationTokens = pgTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const authenticators = pgTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({ columns: [authenticator.userId, authenticator.credentialID] }),
  }),
);
