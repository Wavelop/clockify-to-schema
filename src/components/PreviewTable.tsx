import { useState, useCallback, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import type { ColumnDef, SortState } from '../types/schema'

interface PreviewTableProps {
  columns: ColumnDef[]
  rows: Record<string, string>[]
  selectedRows: Set<number>
  defaultSort?: SortState
  onToggleRow: (idx: number) => void
  onSetAllSelected: (selected: boolean) => void
  onEditCell: (rowIdx: number, columnKey: string, value: string) => void
}

interface EditingCell {
  rowIdx: number
  columnKey: string
}

export function PreviewTable({
  columns,
  rows,
  selectedRows,
  defaultSort,
  onToggleRow,
  onSetAllSelected,
  onEditCell,
}: PreviewTableProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null)
  const [editingValue, setEditingValue] = useState('')
  const [sort, setSort] = useState<SortState | null>(defaultSort ?? null)

  const startEdit = useCallback((rowIdx: number, columnKey: string, currentValue: string) => {
    setEditingCell({ rowIdx, columnKey })
    setEditingValue(currentValue)
  }, [])

  const commitEdit = useCallback(() => {
    if (editingCell) {
      onEditCell(editingCell.rowIdx, editingCell.columnKey, editingValue)
      setEditingCell(null)
    }
  }, [editingCell, editingValue, onEditCell])

  const handleHeaderClick = useCallback((key: string) => {
    setSort(prev => {
      if (prev?.key !== key) return { key, direction: 'asc' }
      if (prev.direction === 'asc') return { key, direction: 'desc' }
      return null
    })
  }, [])

  // Sorted rows with original index preserved
  const sortedRows = useMemo(() => {
    const indexed = rows.map((row, originalIdx) => ({ row, originalIdx }))
    if (!sort) return indexed
    return [...indexed].sort((a, b) => {
      const av = a.row[sort.key] ?? ''
      const bv = b.row[sort.key] ?? ''
      const cmp = av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' })
      return sort.direction === 'asc' ? cmp : -cmp
    })
  }, [rows, sort])

  const allSelected = rows.length > 0 && selectedRows.size === rows.length
  const someSelected = selectedRows.size > 0 && selectedRows.size < rows.length

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: 'hsl(var(--border))' }}>
      <table className="min-w-max w-full text-sm border-collapse">
        <thead>
          <tr style={{ backgroundColor: 'hsl(var(--muted))' }}>
            <th className="px-3 py-2.5 text-left w-10">
              <input
                type="checkbox"
                checked={allSelected}
                ref={el => { if (el) el.indeterminate = someSelected }}
                onChange={e => onSetAllSelected(e.target.checked)}
                className="cursor-pointer size-4 shrink-0"
                aria-label="Seleziona tutte le righe"
              />
            </th>
            {columns.map(col => {
              const isActive = sort?.key === col.key
              const SortIcon = isActive
                ? sort!.direction === 'asc' ? ChevronUp : ChevronDown
                : ChevronsUpDown
              return (
                <th
                  key={col.key}
                  className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:opacity-80"
                  style={{ color: 'hsl(var(--muted-foreground))' }}
                  onClick={() => handleHeaderClick(col.key)}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon className={`h-3 w-3 ${isActive ? 'opacity-100' : 'opacity-30'}`} />
                    {col.editable && (
                      <span
                        className="text-[10px] normal-case tracking-normal font-normal opacity-60"
                        title="Modificabile"
                      >
                        ✎
                      </span>
                    )}
                  </span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map(({ row, originalIdx }, displayIdx) => {
            const isSelected = selectedRows.has(originalIdx)
            const isEven = displayIdx % 2 === 0
            return (
              <tr
                key={originalIdx}
                style={{
                  backgroundColor: isSelected
                    ? undefined
                    : 'hsl(var(--muted) / 0.3)',
                  opacity: isSelected ? 1 : 0.45,
                }}
                className={isEven ? '' : 'bg-muted/10'}
              >
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleRow(originalIdx)}
                    className="cursor-pointer size-4 shrink-0"
                    aria-label={`Riga ${originalIdx + 1}`}
                  />
                </td>
                {columns.map(col => {
                  const isEditing =
                    editingCell?.rowIdx === originalIdx && editingCell?.columnKey === col.key
                  const value = row[col.key] ?? ''

                  return (
                    <td
                      key={col.key}
                      className="px-3 py-2 whitespace-nowrap"
                    >
                      {col.editable && isEditing ? (
                        col.options ? (
                          <select
                            autoFocus
                            value={editingValue}
                            onChange={e => { setEditingValue(e.target.value); onEditCell(originalIdx, col.key, e.target.value); setEditingCell(null) }}
                            onBlur={() => setEditingCell(null)}
                            className="w-full min-w-[140px] px-1 py-0.5 rounded border text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            style={{
                              borderColor: 'hsl(var(--border))',
                              backgroundColor: 'hsl(var(--background))',
                              color: 'hsl(var(--foreground))',
                            }}
                          >
                            {col.options.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            autoFocus
                            value={editingValue}
                            onChange={e => setEditingValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => {
                              if (e.key === 'Enter') commitEdit()
                              if (e.key === 'Escape') setEditingCell(null)
                            }}
                            className="w-full min-w-[120px] px-1 py-0.5 rounded border text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            style={{
                              borderColor: 'hsl(var(--border))',
                              backgroundColor: 'hsl(var(--background))',
                              color: 'hsl(var(--foreground))',
                            }}
                          />
                        )
                      ) : (
                        <span
                          title={col.editable ? 'Clicca per modificare' : value}
                          onClick={
                            col.editable
                              ? () => startEdit(originalIdx, col.key, value)
                              : undefined
                          }
                          className={col.editable ? 'cursor-text hover:underline decoration-dashed underline-offset-2' : ''}
                        >
                          {value || (col.editable ? (
                            <span style={{ color: 'hsl(var(--muted-foreground))' }} className="italic">
                              —
                            </span>
                          ) : '')}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
