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
      // GitHub now returns an RFC 9207 `iss` param on the OAuth callback. Auth.js only
      // validates it against `provider.issuer`, falling back to "https://authjs.dev",
      // so without this the callback fails with CallbackRouteError.
      issuer: 'https://github.com/login/oauth',
    }),
    Passkey,
  ],
  experimental: { enableWebAuthn: true },
});
