import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TimesheetService } from '@/lib/timesheet-service';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await TimesheetService.getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[PROJECTS_FETCH_ERROR]', error);
    return NextResponse.json({ 
      error: 'Failed to fetch projects from Salesforce' 
    }, { status: 500 });
  }
}
