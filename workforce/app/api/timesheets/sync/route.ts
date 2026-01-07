import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TimesheetService } from '@/lib/timesheet-service';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
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
  } catch {
    return NextResponse.json({ 
      error: 'Failed to sync with Salesforce' 
    }, { status: 500 });
  }
}
