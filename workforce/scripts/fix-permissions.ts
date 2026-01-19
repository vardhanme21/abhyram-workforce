import * as dotenv from 'dotenv';
import path from 'path';
import jsforce from 'jsforce';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env.local') });
dotenv.config();

async function fixPermissions() {
  console.log('--- Fixing Permissions (Self-Contained) ---');
  
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const token = process.env.SALESFORCE_SECURITY_TOKEN;
  const loginUrl = process.env.NEXT_PUBLIC_SALESFORCE_LOGIN_URL || 'https://login.salesforce.com';
  
  if (!username || !password) {
      console.error('Missing credentials (SALESFORCE_USERNAME/PASSWORD) in environment!');
      return;
  }

  console.log(`Connecting as ${username}...`);
  const conn = new jsforce.Connection({ loginUrl });
  
  try {
     await conn.login(username, password + (token || ''));
     console.log('Connected!');

     // --- LOGIC START ---
    
interface PermissionSet {
  Id: string;
  Name: string;
}

interface FieldPermission {
  Id: string;
  PermissionsRead: boolean;
  PermissionsEdit: boolean;
}

     // --- LOGIC START ---
    
    // 1. Get Permission Set
    const targetName = 'Workforce_Admin_Access';
    // Explicitly cast the result to avoid 'any' or complex jsforce types mismatch
    let ps = await conn.sobject('PermissionSet').findOne({ Name: targetName }) as unknown as PermissionSet | null;
    
    if (!ps) {
        console.warn(`PermissionSet '${targetName}' not found by API Name.`);
        // Fallback
        const res = await conn.query<PermissionSet>("SELECT Id, Name FROM PermissionSet WHERE Label LIKE '%Workforce%' LIMIT 1");
        if (res.records.length > 0) {
            ps = res.records[0];
            console.log(`Found PermissionSet via Label: ${ps.Name} (${ps.Id})`);
        } else {
             // Fallback 2: Check standard profile or something? No, we need PermissionSet.
            console.error('No suitable PermissionSet found.');
            return;
        }
    } else {
        console.log(`Found PermissionSet: ${ps.Name} (${ps.Id})`);
    }

    // 2. Fix FieldPermissions
    const objectType = 'Employee__c';
    const fieldName = 'Employee__c.Password__c';
    
    console.log(`Checking FieldPermissions for ${fieldName}...`);
    const fp = await conn.sobject('FieldPermissions').findOne({
        ParentId: ps.Id,
        SobjectType: objectType,
        Field: fieldName
    }) as unknown as FieldPermission | null;

    if (fp) {
        console.log('FieldPermissions already exist.');
        if (!fp.PermissionsRead || !fp.PermissionsEdit) {
             console.log('Updating to Read/Edit...');
             await conn.sobject('FieldPermissions').update({
                 Id: fp.Id,
                 PermissionsRead: true,
                 PermissionsEdit: true
             });
             console.log('Updated!');
        } else {
            console.log('Permissions are already correct.');
        }
    } else {
        console.log('FieldPermissions do NOT exist. Creating...');
        try {
            await conn.sobject('FieldPermissions').create({
                ParentId: ps.Id,
                SobjectType: objectType,
                Field: fieldName,
                PermissionsRead: true,
                PermissionsEdit: true
            });
            console.log('Created successfully!');
        } catch (err: unknown) {
             if (err instanceof Error) {
                console.error('Failed to create:', err.message);
             } else {
                console.error('Failed to create:', String(err));
             }
        }
    }

  } catch (err: unknown) {
     if (err instanceof Error) {
        console.error('Connection/Execution Error:', err.message);
     } else {
        console.error('Connection/Execution Error:', String(err));
     }
  }
}

fixPermissions();
