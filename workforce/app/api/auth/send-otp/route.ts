import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // --- REAL OTP SENDING LOGIC ---
    // In production, we would generate a code, save it to Salesforce/Database,
    // and send it via Resend/Twilio.
    console.log(`[AUTH] Generating OTP for ${email}: 123456`);

    // For now, we return success. 
    // In a real app, we wouldn't return the code in the response!
    return NextResponse.json({ 
      success: true, 
      message: 'Verification code sent to your email.' 
    });
  } catch (error) {
    console.error('[AUTH_OTP_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
