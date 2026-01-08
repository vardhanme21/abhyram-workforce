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
          <li>NEXTAUTH_URL: {process.env.NEXTAUTH_URL ? `Set (${process.env.NEXTAUTH_URL})` : <span className="text-red-600 font-bold">MISSING</span>}</li>
          <li>NEXTAUTH_SECRET: {process.env.NEXTAUTH_SECRET ? `Set (Length: ${process.env.NEXTAUTH_SECRET.length})` : <span className="text-red-600 font-bold">MISSING</span>}</li>
          <li>NODE_ENV: {process.env.NODE_ENV}</li>
          <li>Trust Host: {(authOptions as any).trustHost ? 'Enabled' : 'Disabled'}</li>
          <li className="mt-2 text-blue-600 font-semibold">Salesforce Config:</li>
          <li>CLIENT_ID: {process.env.SALESFORCE_CLIENT_ID ? 'Set' : <span className="text-red-600 font-bold">MISSING</span>}</li>
          <li>CLIENT_SECRET: {process.env.SALESFORCE_CLIENT_SECRET ? 'Set' : <span className="text-red-600 font-bold">MISSING</span>}</li>
        </ul>
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <p className="font-bold text-yellow-800">Troubleshooting Steps:</p>
          <ol className="list-decimal pl-5 mt-2 text-sm text-yellow-700">
             <li>If any variables above are <strong>MISSING</strong>, add them in Vercel.</li>
             <li>If all are <strong>Set</strong>, try clicking &quot;Sign In&quot; again.</li>
             <li>Watch the URL bar. If it redirects back to login with an error, tell me the error.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
