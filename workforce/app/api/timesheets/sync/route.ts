import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TimesheetService } from '@/lib/timesheet-service';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    console.log('[SYNC_DEBUG] Session:', JSON.stringify(session, null, 2));

    if (!session || !session.user?.email) {
      console.error('[SYNC_DEBUG] Unauthorized: Missing session or email');
      return NextResponse.json({ error: 'Unauthorized', debug: 'Session missing' }, { status: 401 });
    }

    const data = await request.json();
    
    const result = await TimesheetService.syncWeek({
      email: session.user.email,
      name: session.user.name || undefined,
      weekStart: data.weekStart,
      entries: data.entries,
      status: data.status
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to sync with Salesforce';
    console.error('[SYNC_ERROR]', error);
    return NextResponse.json({ 
      error: message
    }, { status: 500 });
  }
}
