/* eslint-disable @typescript-eslint/no-explicit-any */
import jsforce from 'jsforce';

/**
 * Salesforce Connection Utility
 * 
 * Uses Username/Password flow with Security Token for server-to-server connection.
 */
export async function getSalesforceConnection() {
  const loginUrl = process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('SALESFORCE_CLIENT_ID or SALESFORCE_CLIENT_SECRET is missing. Please set them in Vercel.');
  }

  // 1. Fetch Access Token via Zero-Handshake Client Credentials Flow
  // This is the simplest modern method: No passwords, no refresh tokens, no codes.
  try {
    const tokenRes = await fetch(`${loginUrl}/services/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret
      } as any)
    });

    const tokenData: any = await tokenRes.json();

    if (tokenData.error) {
       // Fallback for older Orgs or misconfigured apps: Try Password/Refresh if they exist
       console.warn('[SF_CLIENT_CRED_FAILED]', tokenData.error_description);
       
       if (process.env.SALESFORCE_REFRESH_TOKEN) {
         const conn = new jsforce.Connection({
           oauth2: { loginUrl, clientId, clientSecret },
           refreshToken: process.env.SALESFORCE_REFRESH_TOKEN
         });
         return conn;
       }
       
       throw new Error(`Salesforce Connection Error: ${tokenData.error_description || tokenData.error}. Ensure "Enable Client Credentials Flow" is checked in your Salesforce Connected App settings.`);
    }

    // 2. Initialize jsforce with the obtained token
    const conn = new jsforce.Connection({
      instanceUrl: tokenData.instance_url,
      accessToken: tokenData.access_token,
      version: '59.0'
    });

    return conn;
  } catch (err: any) {
    console.error('[SALESFORCE_CONNECT_ERROR]', err);
    throw err;
  }
}

/**
 * Syncs a timesheet entry to Salesforce
 */
export async function syncTimesheetToSalesforce(entry: { email: string; name?: string }) {
  const conn = await getSalesforceConnection();
  
  // 1. Find or create Employee record in Salesforce
  let employee = await conn.sobject('Employee__c').findOne({ Email__c: entry.email });
  
  if (!employee) {
    // Auto-create simplified employee if not found
    const result: any = await conn.sobject('Employee__c').create({
      Full_Name__c: entry.name || entry.email.split('@')[0],
      Email__c: entry.email,
      Status__c: 'Active'
    });
    employee = { Id: result.id };
  }

  return { success: true, employeeId: (employee as any).Id };
}
