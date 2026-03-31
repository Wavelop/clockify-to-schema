import * as XLSX from 'xlsx'
import type { ColumnDef } from '../types/schema'

export function exportToXLSX(
  rows: Record<string, string>[],
  columns: ColumnDef[],
  filename: string
): void {
  const header = columns.map(c => c.label)
  const data = rows.map(row => columns.map(c => row[c.key] ?? ''))

  const ws = XLSX.utils.aoa_to_sheet([header, ...data])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Ore')
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}
