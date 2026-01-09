
import { config } from 'dotenv';
config({ path: '.env.local' });
import { getSalesforceConnection } from './lib/salesforce';

async function listCustomObjects() {
  try {
    const conn = await getSalesforceConnection();
    const meta = await conn.describeGlobal();
    const customObjects = meta.sobjects
      .filter(obj => obj.custom)
      .map(obj => obj.name);
    
    console.log('Custom Objects:', customObjects);
  } catch (err) {
    console.error('Error listing objects:', err);
  }
}

listCustomObjects();
