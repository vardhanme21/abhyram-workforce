import Dexie, { type Table } from 'dexie';

export interface DraftTimesheet {
  id?: number;
  weekStartDate: string;
  projectId: string; // Storing simplified entries for demo
  date: string;
  hours: number;
}

export class WorkforceDatabase extends Dexie {
  drafts!: Table<DraftTimesheet>; 

  constructor() {
    super('AbhyramWorkforceDB');
    this.version(1).stores({
      drafts: '++id, weekStartDate, projectId, date'
    });
  }
}

export const db = new WorkforceDatabase();

export async function saveDraftOffline(entry: DraftTimesheet) {
  try {
    // Check if exists
    const existing = await db.drafts
      .where({ projectId: entry.projectId, date: entry.date })
      .first();

    if (existing && existing.id) {
       await db.drafts.update(existing.id, { hours: entry.hours });
    } else {
       await db.drafts.add(entry);
    }
    return true;
  } catch (error) {
    console.error("Failed to save offline:", error);
    return false;
  }
}

export async function getOfflineDrafts(weekStartDate: string) {
    return await db.drafts.where('weekStartDate').equals(weekStartDate).toArray();
}
