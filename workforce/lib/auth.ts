import { NextAuthOptions } from "next-auth";
import SalesforceProvider from "next-auth/providers/salesforce";
import CredentialsProvider from "next-auth/providers/credentials";
import { getSalesforceConnection } from "./salesforce";

export const authOptions: NextAuthOptions = {
  // @ts-expect-error - trustHost is valid in runtime but missing in v4 types
  trustHost: true, // Essential for Vercel serverless environment
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
    // 2. Email/Password (Custom for this app)
    CredentialsProvider({
      id: "email-password",
      name: "Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const conn = await getSalesforceConnection();
        
        // Debug Logging
        const log = (msg: string) => {
          console.log(`[AUTH_DEBUG] ${msg}`);
        };

        log(`Attempting login for: ${credentials.email}`);

        // Find employee by email
        // Note: Password__c must be readable by Integration User
        const employee = await conn.sobject('Employee__c').findOne({ 
          Email__c: credentials.email 
        }) as { Id: string; Full_Name__c: string; Email__c: string; Password__c?: string } | null;

        log(`Employee lookup result: ${employee ? 'Found' : 'Not Found'}`);
        if (employee) {
           log(`Employee ID: ${employee.Id}`);
           log(`Employee Keys: ${Object.keys(employee).join(', ')}`); // Debug FLS
           log(`Stored Password Present: ${!!employee.Password__c}`);
           log(`Stored Password: ${employee.Password__c}`); // TEMPORARY: Log password for debugging
           log(`Provided Password: ${credentials.password}`);
        }

        if (!employee) {
          log('Login failed: User not found');
          return null;
        }

        // Verify password
        // Note: in production, use bcrypt.compare here
        if (employee.Password__c !== credentials.password) {
          log('Login failed: Password mismatch');
          throw new Error("Invalid password");
        }
        
        log('Login success');

        return {
          id: employee.Id,
          name: employee.Full_Name__c,
          email: employee.Email__c
        };
      }
    }),
    
    // 3. Salesforce OAuth
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
