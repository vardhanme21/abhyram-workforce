import { NextRequest, NextResponse } from 'next/server';
import jsforce from 'jsforce';

/**
 * Token Exchange Helper
 * 
 * Usage: /api/debug/token?code=YOUR_CODE_FROM_URL
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(_request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ 
      error: 'Code missing', 
      usage: '/api/debug/token?code=YOUR_AUTHORIZATION_CODE' 
    }, { status: 400 });
  }

  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/callback/salesforce`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'Client ID or Secret missing in environment variables' }, { status: 500 });
  }

  try {
    const conn = new jsforce.Connection({
      oauth2: {
        loginUrl: 'https://login.salesforce.com',
        clientId: clientId,
        clientSecret: clientSecret,
        redirectUri: redirectUri
      }
    });

    // Exchange code for token
    const userInfo = await conn.authorize(code);

    return NextResponse.json({
      message: '✅ SUCCESS! Copy the refresh_token below and add it to Vercel as SALESFORCE_REFRESH_TOKEN.',
      refresh_token: conn.refreshToken,
      instanceUrl: conn.instanceUrl,
      userId: userInfo.id
    });
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('[TOKEN_EXCHANGE_ERROR]', err);
    return NextResponse.json({ 
      error: 'Failed to exchange token', 
      details: error.message || String(err),
      hint: 'Ensure your Redirect URI in Salesforce matches your Vercel URL exactly.'
    }, { status: 500 });
  }
}
