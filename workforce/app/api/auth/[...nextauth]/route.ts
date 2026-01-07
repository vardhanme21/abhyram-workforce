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
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async session({ session, token }) {
      // Pass the Salesforce Access Token to the client if needed for API calls
      return { ...session, accessToken: token.accessToken };
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }
      return token;
    },
  },
})

export { handler as GET, handler as POST }
