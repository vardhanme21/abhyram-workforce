import NextAuth from "next-auth"
import SalesforceProvider from "next-auth/providers/salesforce";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // Mock Email Authentication
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "work@email.com" }
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        
        // In Mock Mode, allow any email
        return {
          id: "mock-user-1",
          name: "Abhyram Employee",
          email: credentials.email,
          image: "https://ui-avatars.com/api/?name=Abhyram+Employee"
        };
      }
    }),
    
    // Salesforce kept as an option
    SalesforceProvider({
      clientId: process.env.SALESFORCE_CLIENT_ID || "",
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
      idToken: true,
      wellKnown: `${process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL}/.well-known/openid-configuration`,
      authorization: { params: { scope: 'openid api refresh_token web' } },
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
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      return { ...session, accessToken: token.accessToken };
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
})

export { handler as GET, handler as POST }
