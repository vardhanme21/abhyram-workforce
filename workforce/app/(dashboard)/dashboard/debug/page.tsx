import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DebugSessionPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session Debug</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {JSON.stringify(session, null, 2)}
      </pre>
      <div className="mt-4">
        <p><strong>Environment Check:</strong></p>
        <ul className="list-disc pl-5">
          <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL || 'Not Set'}</li>
          <li>NODE_ENV: {process.env.NODE_ENV}</li>
          <li>Redirect URI Match: {process.env.NEXTAUTH_URL === 'https://abhyram-workforce.vercel.app' ? 'Yes' : 'No'}</li>
        </ul>
      </div>
    </div>
  );
}
