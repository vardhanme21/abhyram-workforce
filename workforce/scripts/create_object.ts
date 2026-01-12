
import { getSalesforceConnection } from './lib/salesforce';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function createObject() {
  try {
    const conn = await getSalesforceConnection();
    console.log(`Connected to: ${conn.instanceUrl}`);

    // 1. Create Custom Object
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
            deleteConstraint: 'SetNull' // or Restrict
        }
      ]
    };

    console.log('Creating Custom Object and Fields...');
    // Create Object (which includes fields in the definition for CustomObject)
    const result = await conn.metadata.create('CustomObject', objectMetadata);
    
    if (result.success) {
        console.log('Success! Attendance_Log__c created.');
    } else {
        // If it fails, it might be because it already exists or partial failure.
        // If it says "Duplicate Value", that's fine.
        console.log('Result:', JSON.stringify(result, null, 2));
        
        if (Array.isArray(result)) {
             result.forEach(r => {
                 if (!r.success) console.error('Error:', r.errors);
             });
        }
    }

  } catch (err) {
    console.error('Script Error:', err);
  }
}

createObject();
