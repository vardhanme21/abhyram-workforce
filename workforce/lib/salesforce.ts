/* eslint-disable @typescript-eslint/no-explicit-any */
import jsforce from 'jsforce';

/**
 * Salesforce Connection Utility
 * 
 * Uses Username/Password flow with Security Token for server-to-server connection.
 */
export async function getSalesforceConnection() {
  const conn = new jsforce.Connection({
    loginUrl: process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com'
  });

  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const token = process.env.SALESFORCE_SECURITY_TOKEN;

  if (!username || !password || !token) {
    throw new Error('Salesforce credentials (username, password, token) are missing from environment variables.');
  }

  // Use password + security token for authentication
  await conn.login(username, password + token);
  
  return conn;
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
