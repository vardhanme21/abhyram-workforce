import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesforceConnection } from "@/lib/salesforce";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json(); // START or STOP

    const conn = await getSalesforceConnection();
    const userQuery = await conn.query(`SELECT Id FROM Employee__c WHERE Email__c = '${session.user.email}' LIMIT 1`);
    
    // Auto-create employee if missing (robustness)
    let userId: string;
    if (userQuery.totalSize === 0) {
         const empName = session.user.name || 'Unknown';
         const newEmp = await conn.sobject('Employee__c').create({
             Name: empName,
             Full_Name__c: empName,
             Email__c: session.user.email!, // Email is checked above
             Status__c: 'Active'
         });
         if (!newEmp.success) throw new Error("Failed to create Employee record");
         userId = newEmp.id;
    } else {
         userId = userQuery.records[0].Id;
    }

    if (action === 'START') {
        await conn.sobject('Attendance_Log__c').create({
            Employee_Ref__c: userId,
            Login_Time__c: new Date().toISOString(), // JSForce handles Date conversion
            Status__c: 'Active'
        });
    } else if (action === 'STOP') {
        // Find active log
        const logs = await conn.sobject('Attendance_Log__c')
            .find({ 
                Employee_Ref__c: userId, 
                Logout_Time__c: null,
                Status__c: 'Active'
            })
            .sort({ Login_Time__c: -1 })
            .limit(1)
            .execute();

        if (logs.length === 0 || !logs[0].Id) return NextResponse.json({ error: "No active session found" }, { status: 400 });

        await conn.sobject('Attendance_Log__c').update({
            Id: logs[0].Id as string,
            Logout_Time__c: new Date().toISOString(),
            Status__c: 'Completed'
        });
    }

    return NextResponse.json({ success: true });

  } catch (error: unknown) {
    console.error("Attendance Action Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process attendance";
    return NextResponse.json({ 
        error: errorMessage 
    }, { status: 500 });
  }
}
