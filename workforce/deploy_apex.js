
const jsforce = require('jsforce');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: '.env.local' });
dotenv.config();

async function getSalesforceConnection() {
  const loginUrl = process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const securityToken = process.env.SALESFORCE_SECURITY_TOKEN || '';

  if (username && password) {
      console.log('Using Username/Password Flow...');
      const conn = new jsforce.Connection({ loginUrl });
      await conn.login(username, password + securityToken);
      return conn;
  }
  
  if (clientId && clientSecret) {
      console.log('Using Client Credentials Flow...');
       const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);

        const tokenRes = await fetch(`${loginUrl}/services/oauth2/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params
        });

        const tokenData = await tokenRes.json();
        if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

        return new jsforce.Connection({
          instanceUrl: tokenData.instance_url,
          accessToken: tokenData.access_token,
          version: '59.0'
        });
  }
  throw new Error('No credentials found');
}

async function deployApex() {
  const className = 'ProjectAPI';
  // Adjust path to point to 'correct' location relative to this script in 'workforce'
  // workforce/deploy_apex.js -> ../abhyram-backend/...
  const apexPath = path.join(process.cwd(), '../abhyram-backend/force-app/main/default/classes/ProjectAPI.cls');
  
  console.log(`[DEPLOY] Reading Apex class from: ${apexPath}`);
  
  if (!fs.existsSync(apexPath)) {
    console.error(`[DEPLOY] File not found!`);
     // Try current dir or other locations
     console.log('Trying alternative paths...');
     return;
  }

  const apexBody = fs.readFileSync(apexPath, 'utf8');

  try {
    const conn = await getSalesforceConnection();
    console.log(`[DEPLOY] Connected to Salesforce: ${conn.instanceUrl}`);

    const existing = await conn.tooling.sobject('ApexClass').find({ Name: className }).execute();
    
    if (existing.length > 0) {
      console.log(`[DEPLOY] Updating existing class: ${existing[0].Id}`);
      await conn.tooling.sobject('ApexClass').update({
          Id: existing[0].Id,
          Body: apexBody
      });
      console.log(`[DEPLOY] Update Success!`);
    } else {
      console.log(`[DEPLOY] Creating new class...`);
      await conn.tooling.sobject('ApexClass').create({
        Name: className,
        Body: apexBody
      });
      console.log(`[DEPLOY] Create Success!`);
    }

  } catch (err) {
    console.error(`[DEPLOY] Error:`, err);
  }
}

deployApex();
