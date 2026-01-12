
import { config } from 'dotenv';
config({ path: '.env.local' });
import { getSalesforceConnection } from './lib/salesforce';

async function describeProject() {
  try {
    const conn = await getSalesforceConnection();
    const meta = await conn.sobject('Project__c').describe();
    console.log('Fields:', meta.fields.map(f => `${f.name} (${f.type})`).join(', '));
  } catch (err) {
    console.error('Error describing object:', err);
  }
}

describeProject();
