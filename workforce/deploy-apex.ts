import { getSalesforceConnection } from './lib/salesforce';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env or .env.local
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

async function deployApex() {
  const className = 'ProjectAPI';
  const apexPath = path.join(process.cwd(), '../abhyram-backend/force-app/main/default/classes/ProjectAPI.cls');
  
  console.log(`[DEPLOY] Reading Apex class from: ${apexPath}`);
  
  if (!fs.existsSync(apexPath)) {
    console.error(`[DEPLOY] File not found!`);
    process.exit(1);
  }

  const apexBody = fs.readFileSync(apexPath, 'utf8');

  try {
    const conn = await getSalesforceConnection();
    console.log(`[DEPLOY] Connected to Salesforce: ${conn.instanceUrl}`);

    // 1. Find existing class
    const existing = await conn.tooling.sobject('ApexClass').find({ Name: className }).execute();
    
    if (existing.length > 0) {
      console.log(`[DEPLOY] Updating existing class: ${existing[0].Id}`);
      // Use Tooling API to update Body
      // Note: For Apex, we often need to use the MetadataContainer/ApexClassMember for compilation, 
      // but simple updates to Body via Tooling API often fail without a container or valid symbol table if complexity is high.
      // However, for Developer Orgs, direct update might work if no immediate dependencies break.
      // A safer way for single class is Metadata API if available, but let's try Tooling first.
      
      // Actually, updating 'Body' directly on ApexClass is sometimes restricted.
      // Let's try Metadata API (deploy) which is robust but complex... OR
      // simpler: simple Tooling update.
      
      try {
        if (!existing[0].Id) throw new Error("Missing ID on existing class");
        await conn.tooling.sobject('ApexClass').update({
            Id: existing[0].Id,
            Body: apexBody
        });
        console.log(`[DEPLOY] Update Success!`);
      } catch (toolingErr) {
        console.warn(`[DEPLOY] Tooling Update Failed, trying Metadata Upsert...`, toolingErr);
        // Fallback to Metadata API
        // For Metadata API we need base64 zip or raw metadata array
        // conn.metadata.upsert('ApexClass', { fullNames: [className], content: ... }) -> No, metadata api expects .cls content in specific format
        throw toolingErr; 
      }
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
    process.exit(1);
  }
}

deployApex();
