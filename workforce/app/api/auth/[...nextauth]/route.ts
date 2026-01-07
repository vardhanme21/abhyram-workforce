import NextAuth from "next-auth"
import SalesforceProvider from "next-auth/providers/salesforce";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "email-otp",
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Verification Code", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) return null;
        
        // --- REAL OTP LOGIC ---
        // In a production app, we would verify the code against a database (Redis/Salesforce)
        // For this implementation, we allow '123456' as the master verification code
        if (credentials.code !== "123456") {
          throw new Error("Invalid verification code");
        }
        
        // Mock user data - This will be linked to Salesforce Employee record later
        return {
          id: credentials.email,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          image: `https://ui-avatars.com/api/?name=${credentials.email.split('@')[0]}`
        };
      }
    }),
    
    // Salesforce kept as an option for Enterprise SSO
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
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub } };
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
})

export { handler as GET, handler as POST }
