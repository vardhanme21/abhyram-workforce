import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { TimesheetService } from '@/lib/timesheet-service';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.projectName || !data.projectCode) {
      return NextResponse.json({ 
        error: 'Project Name and Project Code are required' 
      }, { status: 400 });
    }

    const result = await TimesheetService.createProject({
      projectName: data.projectName,
      projectCode: data.projectCode,
      status: data.status,
      billable: data.billable,
      projectType: data.projectType,
      startDate: data.startDate,
      endDate: data.endDate,
      budgetHours: data.budgetHours,
      projectManager: data.projectManager,
      billableRate: data.billableRate,
      account: data.account,
      opportunity: data.opportunity
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create project';
    console.error('[PROJECT_CREATE_ERROR]', error);
    return NextResponse.json({ 
      error: message
    }, { status: 500 });
  }
}
