/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSalesforceConnection } from './salesforce';

export interface TimesheetSyncData {
  email: string;
  weekStart: string; // YYYY-MM-DD
  entries: {
    projectId: string; // Salesforce Project__c ID
    date: string;
    hours: number;
  }[];
  status: 'Draft' | 'Submitted';
}

export class TimesheetService {
  /**
   * Fetches all active projects from Salesforce
   */
  static async getProjects() {
    const conn = await getSalesforceConnection();
    const projects = await conn.sobject('Project__c').find({
      Status__c: 'Active'
    });
    
    return projects.map((p: any) => ({
      id: p.Id,
      name: p.Name,
      code: p.Project_Code__c || 'N/A',
      billable: p.Billable__c || false,
      color: p.Color_Code__c || 'bg-blue-500' // Assuming you might add a color field
    }));
  }

  /**
   * Syncs a week worth of timesheet entries to Salesforce
   */
  static async syncWeek(data: TimesheetSyncData) {
    const conn = await getSalesforceConnection();

    // 1. Get or Create Employee ID by Email
    let employee = await conn.sobject('Employee__c').findOne({ Email__c: data.email });
    
    if (!employee) {
      console.log(`[SYNC] Employee record not found for ${data.email}. Creating one...`);
      const result: any = await conn.sobject('Employee__c').create({
        Full_Name__c: data.email.split('@')[0],
        Email__c: data.email,
        Status__c: 'Active'
      });
      employee = { Id: result.id };
    }

    // 2. Find or Create the Header (Timesheet__c)
    // A header usually represents one employee for one week
    let timesheet = await conn.sobject('Timesheet__c').findOne({
      Employee__c: (employee as any).Id,
      Start_Date__c: data.weekStart
    });

    const timesheetData = {
      Employee__c: (employee as any).Id,
      Start_Date__c: data.weekStart,
      Status__c: data.status === 'Submitted' ? 'Submitted' : 'Draft',
      Total_Hours__c: data.entries.reduce((sum, e) => sum + e.hours, 0)
    };

    if (timesheet) {
      await conn.sobject('Timesheet__c').update({
        Id: (timesheet as any).Id,
        ...timesheetData
      } as any);
    } else {
      const result: any = await conn.sobject('Timesheet__c').create(timesheetData as any);
      timesheet = { Id: result.id };
    }

    // 3. Sync Entries (Timesheet_Entry__c)
    // Strategy: Delete existing entries for this header and recreate them
    // (This is often simpler than differential updates in mock environments)
    const existingEntries = await conn.sobject('Timesheet_Entry__c').find({
      Timesheet__c: timesheet.Id
    });

    if (existingEntries.length > 0) {
      await conn.sobject('Timesheet_Entry__c').del(existingEntries.map((e: any) => e.Id));
    }

    // Insert new entries
    const newEntries = data.entries.map(entry => ({
      Timesheet__c: timesheet!.Id,
      Project__c: entry.projectId,
      Date__c: entry.date,
      Hours__c: entry.hours
    }));

    if (newEntries.length > 0) {
      await conn.sobject('Timesheet_Entry__c').create(newEntries);
    }

    return { 
      success: true, 
      timesheetId: timesheet.Id, 
      entryCount: newEntries.length 
    };
  }
}
