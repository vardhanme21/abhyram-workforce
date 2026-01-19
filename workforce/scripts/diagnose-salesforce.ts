import { config } from 'dotenv';
import jsforce from 'jsforce';

// Load env vars
config({ path: '.env.local' });
config(); // fallback to .env

async function diagnose() {
  console.log('--- Salesforce Diagnosis ---');
  
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const token = process.env.SALESFORCE_SECURITY_TOKEN;
  const loginUrl = process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';

  if (!username || !password) {
      console.error('Missing credentials in .env.local');
      console.log('Username:', username);
      console.log('Password (exists):', !!password);
      return;
  }

  console.log(`Connecting as ${username} to ${loginUrl}...`);
  
  const conn = new jsforce.Connection({
    loginUrl: loginUrl
  });

  try {
    await conn.login(username, password + (token || ''));
    console.log('Connected successfully!');

    // 1. Check Schema
    console.log('\n1. Checking Employee__c Schema...');
    try {
        const meta = await conn.sobject('Employee__c').describe();
        const passwordField = meta.fields.find(f => f.name === 'Password__c');
        const emailField = meta.fields.find(f => f.name === 'Email__c');
        
        console.log('Fields found:');
        console.log(`- Email__c: ${!!emailField}`);
        
        if (passwordField) {
            console.log('- Password__c: FOUND');
            console.log('  Properties:', {
                label: passwordField.label,
                type: passwordField.type,
                createable: passwordField.createable,
                updateable: passwordField.updateable,
                nillable: passwordField.nillable,
                length: passwordField.length
            });
        } else {
            console.error('❌ Password__c field NOT FOUND on Employee__c!');
        }
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.error('Failed to describe Employee__c:', e.message);
        } else {
             console.error('Failed to describe Employee__c:', String(e));
        }
    }

interface EmployeeRecord {
  Id: string;
  Name: string;
  Email__c?: string;
  Password__c?: string;
  CreatedDate: string;
}

    // 2. Check Data
    console.log('\n2. Checking Recent Employees...');
    try {
        // Querying for Password__c explicitly
        // Note: Password__c might be hidden if permissions are missing, but we are admin hopefully
        const soql = 'SELECT Id, Name, Email__c, Password__c, CreatedDate FROM Employee__c ORDER BY CreatedDate DESC LIMIT 5';
        const result = await conn.query<EmployeeRecord>(soql);
        
        console.log(`Found ${result.records.length} recent records:`);
        result.records.forEach((r) => {
            console.log(`- ${r.Name} (${r.Email__c})`);
            console.log(`    Id: ${r.Id}`);
            console.log(`    Created: ${r.CreatedDate}`);
            console.log(`    Password__c: '${r.Password__c}'`); // checking if null, empty, or set
            console.log('-------------------');
        });
    } catch (e: unknown) {
        if (e instanceof Error) {
             console.error('Failed to query Employees:', e.message);
        } else {
             console.error('Failed to query Employees:', String(e));
        }
    }

  } catch (err: unknown) {
    if (err instanceof Error) {
        console.error('Fatal Error:', err.message);
    } else {
        console.error('Fatal Error:', String(err));
    }
  }
}

diagnose();
