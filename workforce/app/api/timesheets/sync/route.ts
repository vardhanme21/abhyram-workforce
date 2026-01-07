import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TimesheetService } from '@/lib/timesheet-service';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    const result = await TimesheetService.syncWeek({
      email: session.user.email,
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
