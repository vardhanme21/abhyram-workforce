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
     const result = await conn.apex.get(`/leave/v1/requests?email=${encodeURIComponent(session.user.email)}`);
     return NextResponse.json(result);
  } catch (err) {
      console.error("Leave API Error:", err);
      return NextResponse.json({ success: false, message: "Failed to fetch leaves" }, { status: 200 });
  }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const conn = await getSalesforceConnection();
        
        // Pass email in body to match Apex wrapper
        const payload = { ...body, email: session.user.email };
        
        const result = await conn.apex.post('/leave/v1/requests', payload);
        return NextResponse.json(result);
    } catch (err) {
        console.error("Leave API Post Error:", err);
        return NextResponse.json({ success: false, message: "Failed to submitted leave request" }, { status: 200 });
    }
}
