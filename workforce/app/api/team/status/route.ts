import { NextResponse } from "next/server";
import { getSalesforceConnection } from "@/lib/salesforce";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
     const conn = await getSalesforceConnection();
     const result = await conn.apex.get('/team/v1/status');
     return NextResponse.json({ success: true, data: result });
  } catch (err) {
      console.error("Team Status API Error:", err);
      return NextResponse.json({ success: false, message: "Failed to fetch team status" }, { status: 200 });
  }
}
