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
     
     // Call the custom Apex REST API
     // We pass the email as a query parameter because the integration user
     // needs to know WHICH employee to look up.
     const result = await conn.apex.get(`/intelligence/v1/suggestions?email=${encodeURIComponent(session.user.email)}`);

     return NextResponse.json(result);
  } catch (err) {
      console.error("Intelligence API Error:", err);
      // Return a 200 with success:false so the UI handles it gracefully
      return NextResponse.json({ success: false, message: "Failed to fetch suggestions" }, { status: 200 });
  }
}
