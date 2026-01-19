import { NextResponse } from 'next/server';
import { getSalesforceConnection } from '@/lib/salesforce';

export async function GET() {
  try {
    const conn = await getSalesforceConnection();
    console.log('[DEBUG_FIX] Connected to Salesforce');

    const results = [];
    results.push('Connected to Salesforce');

interface PermissionSetResult {
  Id: string;
  Name: string;
}

    // 1. Get Permission Set
    const targetName = 'Workforce_Admin_Access';
    let ps = await conn.sobject('PermissionSet').findOne({ Name: targetName }) as unknown as PermissionSetResult | null;
    
    if (!ps) {
        results.push(`PermissionSet '${targetName}' not found by API Name. Trying search...`);
        const res = await conn.query<PermissionSetResult>("SELECT Id, Name, Label FROM PermissionSet WHERE Label LIKE '%Workforce%' LIMIT 1");
        if (res.records.length > 0) {
            ps = res.records[0];
            results.push(`Found PermissionSet via Label: ${ps.Name} (${ps.Id})`);
        } else {
            return NextResponse.json({ error: 'No suitable PermissionSet found' }, { status: 404 });
        }
    } else {
        results.push(`Found PermissionSet: ${ps.Name} (${ps.Id})`);
    }

    // 2. Fix FieldPermissions
    const objectType = 'Employee__c';
    const fieldName = 'Employee__c.Password__c';
    
    const fp = await conn.sobject('FieldPermissions').findOne({
        ParentId: ps.Id,
        SobjectType: objectType,
        Field: fieldName
    }) as { Id: string, PermissionsRead: boolean, PermissionsEdit: boolean } | null;

    if (fp) {
        results.push('FieldPermissions already exist.');
        if (!fp.PermissionsRead || !fp.PermissionsEdit) {
             results.push('Updating permissions to Read/Edit...');
             await conn.sobject('FieldPermissions').update({
                 Id: fp.Id,
                 PermissionsRead: true,
                 PermissionsEdit: true
             });
             results.push('Updated successfully!');
        } else {
            results.push('Permissions are already correct.');
        }
    } else {
        results.push('FieldPermissions do NOT exist. Creating...');
        try {
            await conn.sobject('FieldPermissions').create({
                ParentId: ps.Id,
                SobjectType: objectType,
                Field: fieldName,
                PermissionsRead: true,
                PermissionsEdit: true
            });
            results.push('Created successfully!');
        } catch (err: unknown) {
             const msg = err instanceof Error ? err.message : String(err);
            results.push(`Failed to create: ${msg}`);
            return NextResponse.json({ results, error: msg }, { status: 500 });
        }
    }

    return NextResponse.json({ success: true, log: results });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    console.error('[DEBUG_FIX] Error:', msg);
    return NextResponse.json({ error: msg, stack }, { status: 500 });
  }
}
