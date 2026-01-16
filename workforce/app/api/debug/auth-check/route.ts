import { NextResponse } from 'next/server';
import { getSalesforceConnection } from '@/lib/salesforce';

export async function GET() {
  const logs: string[] = [];
  const log = (msg: string, data?: unknown) => {
    console.log(msg, data || '');
    logs.push(`${msg} ${data ? JSON.stringify(data) : ''}`);
  };

  try {
    log('[DEBUG] Connecting to Salesforce...');
    log('Env Check:', {
      HAS_CLIENT_ID: !!process.env.SALESFORCE_CLIENT_ID,
      HAS_CLIENT_SECRET: !!process.env.SALESFORCE_CLIENT_SECRET,
      HAS_USERNAME: !!process.env.SALESFORCE_USERNAME,
      HAS_PASSWORD: !!process.env.SALESFORCE_PASSWORD,
    });
    const conn = await getSalesforceConnection();
    log('[DEBUG] Connected!');

    // 1. Check if Password__c field exists on Employee__c
    log('[DEBUG] Describing Employee__c object...');
    const meta = await conn.sobject('Employee__c').describe();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const passwordField = meta.fields.find((f: any) => f.name === 'Password__c');

    if (!passwordField) {
      log('[CRITICAL] Password__c field NOT found on Employee__c object!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      log('Available fields:', meta.fields.map((f: any) => f.name).join(', '));
      return NextResponse.json({ success: false, logs });
    } else {
      log('[SUCCESS] Password__c field found.');
      log('Field details:', {
        label: passwordField.label,
        type: passwordField.type,
        createable: passwordField.createable,
        updateable: passwordField.updateable,
        filterable: passwordField.filterable
      });
    }

    // 2. Create a test user with a password
    const testEmail = `debug_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    log(`[DEBUG] Creating test user: ${testEmail}`);
    const createResult = await conn.sobject('Employee__c').create({
      Name: 'Debug User',
      Full_Name__c: 'Debug User',
      Email__c: testEmail,
      Password__c: testPassword,
      Status__c: 'Active'
    });

    if (!createResult.success) {
      log('[DEBUG] Create failed:', createResult.errors);
      return NextResponse.json({ success: false, logs });
    }
    const userId = createResult.id;
    log(`[DEBUG] Created user ID: ${userId}`);

    // 3. Query the user back to see if we can read the password
    log('[DEBUG] Querying user back...');
    const record = await conn.sobject('Employee__c').retrieve(userId);
    
    log('[DEBUG] Record retrieved:', record);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((record as any)['Password__c'] === testPassword) {
      log('[SUCCESS] Password saved and retrieved correctly!');
    } else {
      log('[CRITICAL] Password mismatch or missing in retrieval!');
      log(`Expected: ${testPassword}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      log(`Actual: ${(record as any)['Password__c']}`);
    }

    // Cleanup
    log('[DEBUG] Cleaning up...');
    await conn.sobject('Employee__c').destroy(userId);
    log('[DEBUG] Cleanup done.');

    return new NextResponse(logs.join('\n'), { 
      status: 200, 
      headers: { 'Content-Type': 'text/plain' } 
    });

  } catch (err) {
    log('[DEBUG] Exception:', (err as Error).message);
    logs.push(`Error: ${(err as Error).message}`);
    return new NextResponse(logs.join('\n'), { 
      status: 500, 
      headers: { 'Content-Type': 'text/plain' } 
    });
  }
}
