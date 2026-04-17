import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Passkey from 'next-auth/providers/passkey';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from 'drizzle/db';
import { accounts, authenticators, sessions, users, verificationTokens } from 'drizzle/schema';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Passkey,
  ],
  experimental: { enableWebAuthn: true },
});
