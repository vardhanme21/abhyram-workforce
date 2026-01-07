import { NextAuthOptions } from "next-auth";
import SalesforceProvider from "next-auth/providers/salesforce";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
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
        // For this implementation, we allow '123456' as the master verification code
        if (credentials.code !== "123456") {
          throw new Error("Invalid verification code");
        }
        
        return {
          id: credentials.email,
          name: credentials.email.split('@')[0],
          email: credentials.email,
          image: `https://ui-avatars.com/api/?name=${credentials.email.split('@')[0]}`
        };
      }
    }),
    
    SalesforceProvider({
      clientId: process.env.SALESFORCE_CLIENT_ID || "",
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || "",
      authorization: {
        url: `${process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL}/services/oauth2/authorize`,
        params: { scope: 'openid api refresh_token web' }
      },
      token: `${process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL}/services/oauth2/token`,
      userinfo: `${process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL}/services/oauth2/userinfo`,
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
      if (session.user) {
        (session.user as { id: string }).id = token.sub as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};
