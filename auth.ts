import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      // GitHub now returns an RFC 9207 `iss` param on the OAuth callback. Auth.js only
      // validates it against `provider.issuer`, falling back to "https://authjs.dev",
      // so without this the callback fails with CallbackRouteError.
      issuer: 'https://github.com/login/oauth',
    }),
  ],
});
