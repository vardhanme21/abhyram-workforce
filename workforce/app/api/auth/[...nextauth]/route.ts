import NextAuth from "next-auth"
import SalesforceProvider from "next-auth/providers/salesforce";

const handler = NextAuth({
  providers: [
    SalesforceProvider({
      clientId: process.env.SALESFORCE_CLIENT_ID || "",
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
      idToken: true,
      wellKnown: `${process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: 'openid api refresh_token web'
        }
      },
      userinfo: {
        async request({ client, tokens }) {
          // Get user info from Salesforce UserInfo endpoint
          return await client.userinfo(tokens.access_token!);
        },
      },
      profile(profile) {
        return {
          id: profile.user_id,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
  ],
  // Add debug logging to help with deployment troubleshooting
  debug: true,
  logger: {
    error(code, metadata) {
      console.error('NEXTAUTH_ERROR', code, metadata)
    },
    warn(code) {
      console.warn('NEXTAUTH_WARN', code)
    },
    debug(code, metadata) {
      console.log('NEXTAUTH_DEBUG', code, metadata)
    }
  },
  callbacks: {
    async session({ session, token }) {
      console.log('SESSION_CALLBACK', { hasToken: !!token });
      return { ...session, accessToken: token.accessToken };
    },
    async jwt({ token, account, profile }) {
      console.log('JWT_CALLBACK', { hasAccount: !!account, hasProfile: !!profile });
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
  },
})

export { handler as GET, handler as POST }
