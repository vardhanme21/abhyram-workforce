/* eslint-disable @typescript-eslint/no-explicit-any */
import jsforce from 'jsforce';

/**
 * Salesforce Connection Utility
 * 
 * Uses Username/Password flow with Security Token for server-to-server connection.
 */
export async function getSalesforceConnection() {
  // For dev-ed and production, ALWAYS use login.salesforce.com for the auth endpoint
  // even if the instance has a specific URL. 
  const authUrl = 'https://login.salesforce.com';
  
  const conn = new jsforce.Connection({
    oauth2: {
      loginUrl: authUrl,
      clientId: process.env.SALESFORCE_CLIENT_ID || '',
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || ''
    }
  });

  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const token = process.env.SALESFORCE_SECURITY_TOKEN;

  if (!username || !password || !token) {
    throw new Error('Salesforce credentials missing from environment variables.');
  }

  try {
    // When oauth2 is provided in the constructor, conn.login uses the OAuth2 Password Grant flow (REST)
    await conn.login(username, password + token);
    return conn;
  } catch (err: any) {
    console.error('[SALESFORCE_AUTH_CRITICAL]', err);
    if (err.message === 'authentication failure') {
      throw new Error('Salesforce Authentication Failure: Please check "Allow OAuth Username-Password Flows" in Salesforce Org Setup and verify your Security Token.');
    }
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
