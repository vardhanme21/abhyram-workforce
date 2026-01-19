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
     // Pass email as param
     const result = await conn.apex.get(`/gamification/v1/stats?email=${encodeURIComponent(session.user.email)}`);

     // If the API returns direct object or just wrap it
     return NextResponse.json({ success: true, data: result });
  } catch (err) {
      console.error("Gamification API Error:", err);
      // Return mock data fallback for dev if API fails (or while deploying)
      // return NextResponse.json({ success: true, data: { streak: 5, level: 3, xp: 2400, nextLevelXp: 3000, badge: 'Time Lord' } });
      return NextResponse.json({ success: false, message: "Failed to fetch stats" }, { status: 200 });
  }
}
