import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import jsforce from 'jsforce';

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL ? '✅ Present' : '❌ Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Present' : '❌ Missing',
      SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME ? '✅ Present' : '❌ Missing',
      SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD ? '✅ Present' : '❌ Missing',
      SALESFORCE_SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN ? '✅ Present' : '❌ Missing',
      SALESFORCE_REFRESH_TOKEN: process.env.SALESFORCE_REFRESH_TOKEN ? '✅ Present' : '⚠️ Missing (Recommended)',
      SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID ? '✅ Present' : '❌ Missing',
      SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET ? '✅ Present' : '❌ Missing',
      SALESFORCE_LOGIN_URL: process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
    },
    auth_link_step_1: process.env.SALESFORCE_CLIENT_ID ? 
      `https://login.salesforce.com/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent((process.env.NEXT_PUBLIC_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/callback/salesforce`).replace('http://localhost:3000', process.env.NEXTAUTH_URL || ''))}&scope=api%20refresh_token%20offline_access` : 
      '❌ Cannot generate link (Client ID missing)',
    session: null,
    salesforce_test: 'Not Started'
  };

  try {
    const session = await getServerSession(authOptions);
    diagnostics.session = session ? {
      status: '✅ Active',
      user: {
        email: session.user?.email,
        name: session.user?.name
      }
    } : { status: '❌ Not Found (Unauthorized)' };

    // Test Salesforce Connection in isolation
    if (process.env.SALESFORCE_USERNAME && process.env.SALESFORCE_PASSWORD) {
      try {
        const conn = new jsforce.Connection({
          oauth2: {
            loginUrl: diagnostics.env.SALESFORCE_LOGIN_URL,
            clientId: process.env.SALESFORCE_CLIENT_ID || '',
            clientSecret: process.env.SALESFORCE_CLIENT_SECRET || ''
          }
        });
        await conn.login(
          process.env.SALESFORCE_USERNAME, 
          (process.env.SALESFORCE_PASSWORD || '') + (process.env.SALESFORCE_SECURITY_TOKEN || '')
        );
        diagnostics.salesforce_test = '✅ Successful (REST/OAuth2)';
      } catch (sfErr) {
        diagnostics.salesforce_test = `❌ Failed: ${sfErr instanceof Error ? sfErr.message : String(sfErr)}`;
      }
    } else {
      diagnostics.salesforce_test = '⚠️ Skipped (Credentials missing)';
    }

    return NextResponse.json(diagnostics);
  } catch (err) {
    return NextResponse.json({ 
      error: 'Diagnostic service failed',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
