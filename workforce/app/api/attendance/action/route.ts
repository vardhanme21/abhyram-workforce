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
    const userQuery = await conn.query(`SELECT Id FROM User WHERE Email = '${session.user.email}' LIMIT 1`);
    if (userQuery.totalSize === 0) throw new Error("User not found");
    const userId = userQuery.records[0].Id;

    if (action === 'START') {
        await conn.sobject('Attendance_Log__c').create({
            Employee__c: userId,
            Login_Time__c: new Date().toISOString(), // JSForce handles Date conversion
            Status__c: 'Active'
        });
    } else if (action === 'STOP') {
        // Find active log
        const logs = await conn.sobject('Attendance_Log__c')
            .find({ 
                Employee__c: userId, 
                Logout_Time__c: null,
                Status__c: 'Active'
            })
            .sort({ Login_Time__c: -1 })
            .limit(1)
            .execute();

        if (logs.length === 0) return NextResponse.json({ error: "No active session found" }, { status: 400 });

        await conn.sobject('Attendance_Log__c').update({
            Id: logs[0].Id,
            Logout_Time__c: new Date().toISOString(),
            Status__c: 'Completed'
        });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Attendance Action Error:", error);
    return NextResponse.json({ 
        error: error.message || "Failed to process attendance" 
    }, { status: 500 });
  }
}
