
import jsforce from 'jsforce';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function checkObject() {
  try {
    const loginUrl = process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
    const username = process.env.SALESFORCE_USERNAME;
    const password = process.env.SALESFORCE_PASSWORD;
    const securityToken = process.env.SALESFORCE_SECURITY_TOKEN || '';

    if (!username || !password) {
        console.error('Missing credentials');
        return;
    }

    const conn = new jsforce.Connection({ loginUrl });
    await conn.login(username, password + securityToken);
    console.log(`Connected to: ${conn.instanceUrl}`);

    try {
        const describe = await conn.describeSObject('Attendance_Log__c');
        console.log('Object Exists!');
        console.log('Label:', describe.label);
        console.log('Fields:', describe.fields.map(f => f.name).join(', '));
    } catch (err: any) {
        console.error('Describe Failed (Object might not exist):', err.message);
        
        // Try listing all custom objects to be sure
        console.log('Listing all custom objects...');
        const types = [{ type: 'CustomObject', folder: null }];
        const list = await conn.metadata.list(types, '59.0');
        
        if (Array.isArray(list)) {
            const found = list.find((o: any) => o.fullName === 'Attendance_Log__c');
            if (found) {
                console.log('FOUND in Metadata List but describe failed (maybe permissions?):', found);
            } else {
                console.log('NOT FOUND in Metadata List.');
            }
        }
    }

  } catch (err) {
    console.error('Script Error:', err);
  }
}

checkObject();
