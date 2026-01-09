
import { getSalesforceConnection } from './lib/salesforce';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function deployAttendanceAPI() {
  const className = 'AttendanceAPI';
  const apexPath = path.join(process.cwd(), '../abhyram-backend/force-app/main/default/classes/AttendanceAPI.cls');
  
  if (!fs.existsSync(apexPath)) {
    console.error(`[DEPLOY] File not found: ${apexPath}`);
    process.exit(1);
  }

  const apexBody = fs.readFileSync(apexPath, 'utf8');

  try {
    const conn = await getSalesforceConnection();
    console.log(`[DEPLOY] Connected to Salesforce: ${conn.instanceUrl}`);

    const existing = await conn.tooling.sobject('ApexClass').find({ Name: className }).execute();
    
    if (existing.length > 0) {
        console.log(`[DEPLOY] Updating existing class...`);
        await conn.tooling.sobject('ApexClass').update({
            Id: existing[0].Id,
            Body: apexBody
        });
    } else {
        console.log(`[DEPLOY] Creating new class...`);
        await conn.tooling.sobject('ApexClass').create({
            Name: className,
            Body: apexBody
        });
    }
    console.log(`[DEPLOY] Success!`);

  } catch (err: any) {
    console.error(`[DEPLOY] Error:`, err.message || err);
    if (err.message && err.message.includes("Invalid type: Attendance_Log__c")) {
        console.log("\n[ACTION REQUIRED] It seems the 'Attendance_Log__c' object does not exist. Please create it manually or request me to use a different object.");
    }
    process.exit(1);
  }
}

deployAttendanceAPI();
