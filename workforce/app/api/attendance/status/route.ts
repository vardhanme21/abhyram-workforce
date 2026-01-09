import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSalesforceConnection } from "@/lib/salesforce";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const conn = await getSalesforceConnection();
        // Use user ID (lookup from email if needed, or assumng session has SF ID)
        // QUERY EMPLOYEE__C (Custom Object) instead of User
        const userQuery = await conn.query(`SELECT Id FROM Employee__c WHERE Email__c = '${session.user.email}' LIMIT 1`);
        
        if (userQuery.totalSize === 0) {
             // Optional: Auto-create employee if strictly needed, but usually signup handles it.
             // For now, return inactive if no employee text found.
             return NextResponse.json({ isActive: false });
        }
        const userId = userQuery.records[0].Id;

        // Query direct status from Attendance_Log__c
        const logs = await conn.sobject('Attendance_Log__c')
            .find({ 
                Employee_Ref__c: userId, 
                Logout_Time__c: null,
                Status__c: 'Active'
            })
            .sort({ Login_Time__c: -1 })
            .limit(1)
            .execute();

        if (logs.length > 0) {
            return NextResponse.json({ 
                isActive: true, 
                loginTime: logs[0].Login_Time__c 
            });
        }
        return NextResponse.json({ isActive: false });

    } catch (sfError: unknown) {
        const msg = sfError instanceof Error ? sfError.message : "Unknown Salesforce Error";
        console.warn("Salesforce sync failed", msg);
        return NextResponse.json({ isActive: false });
    }

  } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
