import Dexie, { type Table } from 'dexie'

export interface ImportState {
  id?: number
  schemaId: string
  rawContent: string
  editedCells: Record<number, Record<string, string>>
  selectedRows: number[]
  lastModified: Date
}

class ExportDB extends Dexie {
  imports!: Table<ImportState>

  constructor() {
    super('ExportDB')
    this.version(1).stores({
      imports: '++id, &schemaId',
    })
  }
}

export const db = new ExportDB()

export async function getImportState(schemaId: string): Promise<ImportState | undefined> {
  return db.imports.where('schemaId').equals(schemaId).first()
}

export async function saveImportState(state: Omit<ImportState, 'id'>): Promise<void> {
  const existing = await db.imports.where('schemaId').equals(state.schemaId).first()
  if (existing?.id !== undefined) {
    await db.imports.update(existing.id, { ...state, lastModified: new Date() })
  } else {
    await db.imports.add({ ...state, lastModified: new Date() })
  }
}

export async function clearImportState(schemaId: string): Promise<void> {
  await db.imports.where('schemaId').equals(schemaId).delete()
}

// ─── Dark mode preference (localStorage) ─────────────────────────────────────

export function getDarkMode(): boolean {
  return localStorage.getItem('darkMode') === 'true'
}

export function setDarkMode(value: boolean): void {
  localStorage.setItem('darkMode', String(value))
}
