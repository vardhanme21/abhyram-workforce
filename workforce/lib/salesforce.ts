/* eslint-disable @typescript-eslint/no-explicit-any */
import jsforce from 'jsforce';

/**
 * Salesforce Connection Utility
 * 
 * Uses Username/Password flow with Security Token for server-to-server connection.
 */
export async function getSalesforceConnection() {
  const authUrl = 'https://login.salesforce.com';
  
  const connData: any = {
    oauth2: {
      loginUrl: authUrl,
      clientId: process.env.SALESFORCE_CLIENT_ID || '',
      clientSecret: process.env.SALESFORCE_CLIENT_SECRET || ''
    }
  };

  // If we have a refresh token, use it! This is more reliable than password flow.
  if (process.env.SALESFORCE_REFRESH_TOKEN) {
    connData.refreshToken = process.env.SALESFORCE_REFRESH_TOKEN;
  }

  const conn = new jsforce.Connection(connData);

  // If no refresh token, try Legacy Password Grant (might be disabled in Org)
  if (!process.env.SALESFORCE_REFRESH_TOKEN) {
    const username = process.env.SALESFORCE_USERNAME;
    const password = process.env.SALESFORCE_PASSWORD;
    const token = process.env.SALESFORCE_SECURITY_TOKEN;

    if (!username || !password || !token) {
      throw new Error('Salesforce credentials missing from environment variables (No Refresh Token or Password found).');
    }

    try {
      await conn.login(username, password + token);
    } catch (err: any) {
      console.error('[SALESFORCE_AUTH_CRITICAL]', err);
      if (err.message === 'authentication failure') {
        throw new Error('Salesforce Authentication Failure: Password flow is likely disabled. Please use SALESFORCE_REFRESH_TOKEN instead.');
      }
      throw err;
    }
  }
  
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
