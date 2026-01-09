
import jsforce from 'jsforce';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function getConnection() {
  const loginUrl = process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const securityToken = process.env.SALESFORCE_SECURITY_TOKEN || '';

  // Try Username/Password Flow first for script simplicity
  if (username && password) {
    try {
      console.log('Logging in with Username/Password...');
      const conn = new jsforce.Connection({ loginUrl });
      await conn.login(username, password + securityToken);
      return conn;
    } catch (err) {
      console.warn('Username/Password login failed, trying Client Creds if available...', err);
    }
  }
  
  // Try Client Creds
  if (clientId && clientSecret) {
      console.log('Logging in with Client Credentials...');
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', clientId);
      params.append('client_secret', clientSecret);
      
      const tokenRes = await fetch(`${loginUrl}/services/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      const tokenData = await tokenRes.json() as { access_token: string; instance_url: string; error_description?: string };
      if (tokenData.access_token) {
        return new jsforce.Connection({
            instanceUrl: tokenData.instance_url,
            accessToken: tokenData.access_token
        });
      }
      throw new Error(tokenData.error_description || 'Auth failed');
  }
  
  throw new Error('No valid credentials found');
}

async function createObject() {
  try {
    const conn = await getConnection();
    console.log(`Connected to: ${conn.instanceUrl}`);

    const objectMetadata = {
      fullName: 'Attendance_Log__c',
      label: 'Attendance Log',
      pluralLabel: 'Attendance Logs',
      deploymentStatus: 'Deployed',
      sharingModel: 'ReadWrite',
      nameField: {
        type: 'AutoNumber',
        label: 'Log ID',
        displayFormat: 'ATT-{0000}'
      },
      fields: [
        {
          fullName: 'Login_Time__c',
          label: 'Login Time',
          type: 'DateTime'
        },
        {
            fullName: 'Logout_Time__c',
            label: 'Logout Time',
            type: 'DateTime'
        },
        {
            fullName: 'Status__c',
            label: 'Status',
            type: 'Text',
            length: 50
        },
        {
            fullName: 'Employee__c',
            label: 'Employee',
            type: 'Lookup',
            referenceTo: 'User',
            relationshipName: 'Attendance_Logs',
            deleteConstraint: 'SetNull' 
        }
      ]
    };

    console.log('Creating Custom Object...');
    // Upsert equivalent via metadata create? Metadata API create usually fails if exists.
    // We can use 'upsert' but that requires full metadata array structure usually.
    // Let's try create, catch error if exists.
    
    // Check if exists first?
    try {
        await conn.metadata.read('CustomObject', ['Attendance_Log__c']);
        // If read succeeds it just returns array.
    } catch {
        // ignore
    }

    const result = await conn.metadata.create('CustomObject', objectMetadata);
    
    if (result.success) {
        console.log('Success! Attendance_Log__c created.');
        fs.writeFileSync('creation_result.json', JSON.stringify({ success: true, message: 'Created' }));
    } else {
        console.log('Result:', JSON.stringify(result, null, 2));
        fs.writeFileSync('creation_result.json', JSON.stringify({ success: false, result }));
    }

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Script Error:', msg);
    fs.writeFileSync('creation_result.json', JSON.stringify({ success: false, error: msg }));
  }
}

import * as fs from 'fs';
createObject();
