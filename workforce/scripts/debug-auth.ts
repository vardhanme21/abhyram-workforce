import { getSalesforceConnection } from '../lib/salesforce';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('[DEBUG-SCRIPT] Script started');

async function debugAuth() {
  try {
    console.log('[DEBUG-SCRIPT] Connecting to Salesforce...');
    const conn = await getSalesforceConnection();
    console.log('[DEBUG] Connected!');

    // 1. Check if Password__c field exists on Employee__c
    console.log('[DEBUG] Describing Employee__c object...');
    const meta = await conn.sobject('Employee__c').describe();
    const passwordField = meta.fields.find((f: any) => f.name === 'Password__c');

    if (!passwordField) {
      console.error('[CRITICAL] Password__c field NOT found on Employee__c object!');
      console.log('Available fields:', meta.fields.map((f: any) => f.name).join(', '));
      return;
    } else {
      console.log('[SUCCESS] Password__c field found.');
      console.log('Field details:', {
        label: passwordField.label,
        type: passwordField.type,
        createable: passwordField.createable,
        updateable: passwordField.updateable, // Note: updateable is the correct property name in jsforce
        filterable: passwordField.filterable
      });
    }

    // 2. Create a test user with a password
    const testEmail = `debug_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    console.log(`[DEBUG] Creating test user: ${testEmail}`);
    const createResult = await conn.sobject('Employee__c').create({
      Name: 'Debug User',
      Full_Name__c: 'Debug User',
      Email__c: testEmail,
      Password__c: testPassword,
      Status__c: 'Active'
    });

    if (!createResult.success) {
      console.error('[DEBUG] Create failed:', createResult.errors);
      return;
    }
    const userId = createResult.id;
    console.log(`[DEBUG] Created user ID: ${userId}`);

    // 3. Query the user back to see if we can read the password
    console.log('[DEBUG] Querying user back...');
    const record = await conn.sobject('Employee__c').retrieve(userId);
    
    console.log('[DEBUG] Record retrieved:', JSON.stringify(record, null, 2));

    if (record['Password__c'] === testPassword) { // jsforce returns fields as properties, accessing dynamically
      console.log('[SUCCESS] Password saved and retrieved correctly!');
    } else {
      console.error('[CRITICAL] Password mismatch or missing in retrieval!');
      console.log(`Expected: ${testPassword}`);
      console.log(`Actual: ${record['Password__c']}`);
    }

    // Cleanup
    console.log('[DEBUG] Cleaning up...');
    await conn.sobject('Employee__c').destroy(userId);
    console.log('[DEBUG] Cleanup done.');

  } catch (err) {
    console.error('[DEBUG] script exception:', err);
  }
}

debugAuth();
