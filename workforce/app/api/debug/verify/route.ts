import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSalesforceConnection } from '@/lib/salesforce';

export async function GET(request: NextRequest) {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || '❌ Missing',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? '✅ Present' : '❌ Missing',
      SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME ? '✅ Present' : '❌ Missing',
      SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD ? '✅ Present' : '❌ Missing',
      SALESFORCE_SECURITY_TOKEN: process.env.SALESFORCE_SECURITY_TOKEN ? '✅ Present' : '❌ Missing',
      SALESFORCE_REFRESH_TOKEN: process.env.SALESFORCE_REFRESH_TOKEN ? '✅ Present' : '⚠️ Missing (Recommended)',
      SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID ? '✅ Present' : '❌ Missing',
      SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET ? '✅ Present' : '❌ Missing',
      SALESFORCE_LOGIN_URL: process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com',
      NEXT_PUBLIC_REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI || '❌ Missing',
      CURRENT_ORIGIN: request.headers.get('origin') || 'Unknown',
      DOMAIN_MATCH: (process.env.NEXTAUTH_URL && request.headers.get('host') && process.env.NEXTAUTH_URL.includes(request.headers.get('host') as string)) ? '✅ Match' : '❌ Mismatch (Check Vercel Env)',
    },
    auth_link_step_1: process.env.SALESFORCE_CLIENT_ID ? 
      `${process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'}/services/oauth2/authorize?response_type=code&client_id=${process.env.SALESFORCE_CLIENT_ID}&redirect_uri=${encodeURIComponent((process.env.NEXT_PUBLIC_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/callback/salesforce`).replace('http://localhost:3000', process.env.NEXTAUTH_URL || ''))}&scope=api%20refresh_token%20offline_access` : 
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

    // Test Salesforce Connection via getSalesforceConnection (Unified Test)
    try {
      const conn = await getSalesforceConnection();
      const identity = await conn.identity() as { username: string };
      diagnostics.salesforce_test = `✅ Successful (Connected as: ${identity.username})`;
    } catch (sfErr: unknown) {
      const error = sfErr as { message?: string };
      diagnostics.salesforce_test = `❌ Failed: ${error.message || String(sfErr)}`;
      
      if (error.message?.includes('unsupported_grant_type')) {
        diagnostics.salesforce_test += ' | 💡 FIX: Check "Enable Client Credentials Flow" in your Connected App settings.';
      }
    }

    return NextResponse.json(diagnostics);
  } catch (err) {
    return NextResponse.json({ 
      error: 'Diagnostic service failed',
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}
