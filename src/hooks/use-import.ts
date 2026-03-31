import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import type { Schema } from '../types/schema'
import { parseCSV } from '../lib/csv'
import { applySchema } from '../lib/transform'
import { getImportState, saveImportState, clearImportState } from '../lib/db'

export interface UseImportReturn {
  /** Rows as they will appear in the export (schema applied + user edits merged) */
  outputRows: Record<string, string>[]
  /** Which row indices are selected for export */
  selectedRows: Set<number>
  /** Whether we have a loaded CSV */
  hasData: boolean
  /** Load a raw CSV string and apply the schema */
  loadCSV: (content: string) => void
  /** Toggle a single row's selection */
  toggleRow: (idx: number) => void
  /** Select / deselect all rows */
  setAllSelected: (selected: boolean) => void
  /** Update a single cell value */
  editCell: (rowIdx: number, columnKey: string, value: string) => void
  /** Clear everything (remove import) */
  reset: () => void
}

export function useImport(schema: Schema): UseImportReturn {
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([])
  const [editedCells, setEditedCells] = useState<Record<number, Record<string, string>>>({})
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  // Load persisted state on mount
  useEffect(() => {
    getImportState(schema.id).then(state => {
      if (!state) return
      const parsed = parseCSV(state.rawContent, schema.inputDelimiter ?? ',')
      setRawRows(parsed)
      setEditedCells(state.editedCells)
      setSelectedRows(new Set(state.selectedRows))
    })
  }, [schema.id, schema.inputDelimiter])

  // Debounced persistence
  const persistRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rawRowsRef = useRef(rawRows)
  rawRowsRef.current = rawRows

  const persist = useCallback(
    (
      rows: Record<string, string>[],
      edits: Record<number, Record<string, string>>,
      selected: Set<number>,
      rawContent: string
    ) => {
      if (persistRef.current) clearTimeout(persistRef.current)
      persistRef.current = setTimeout(() => {
        if (rows.length === 0) return
        saveImportState({
          schemaId: schema.id,
          rawContent,
          editedCells: edits,
          selectedRows: Array.from(selected),
          lastModified: new Date(),
        })
      }, 500)
    },
    [schema.id]
  )

  // Keep a ref to raw CSV content so we can persist it on edits too
  const rawContentRef = useRef('')

  const loadCSV = useCallback(
    (content: string) => {
      rawContentRef.current = content
      const parsed = parseCSV(content, schema.inputDelimiter ?? ',')
      const allSelected = new Set(parsed.map((_, i) => i))
      setRawRows(parsed)
      setEditedCells({})
      setSelectedRows(allSelected)
      persist(parsed, {}, allSelected, content)
    },
    [schema.inputDelimiter, persist]
  )

  const toggleRow = useCallback(
    (idx: number) => {
      setSelectedRows(prev => {
        const next = new Set(prev)
        if (next.has(idx)) next.delete(idx)
        else next.add(idx)
        persist(rawRowsRef.current, editedCells, next, rawContentRef.current)
        return next
      })
    },
    [editedCells, persist]
  )

  const setAllSelected = useCallback(
    (selected: boolean) => {
      const next = selected ? new Set(rawRowsRef.current.map((_, i) => i)) : new Set<number>()
      setSelectedRows(next)
      persist(rawRowsRef.current, editedCells, next, rawContentRef.current)
    },
    [editedCells, persist]
  )

  const editCell = useCallback(
    (rowIdx: number, columnKey: string, value: string) => {
      setEditedCells(prev => {
        const next = { ...prev, [rowIdx]: { ...(prev[rowIdx] ?? {}), [columnKey]: value } }
        persist(rawRowsRef.current, next, selectedRows, rawContentRef.current)
        return next
      })
    },
    [selectedRows, persist]
  )

  const reset = useCallback(() => {
    rawContentRef.current = ''
    setRawRows([])
    setEditedCells({})
    setSelectedRows(new Set())
    clearImportState(schema.id)
  }, [schema.id])

  // Base output rows (schema applied)
  const baseRows = useMemo(() => applySchema(rawRows, schema), [rawRows, schema])

  // Merge user edits on top
  const outputRows = useMemo(() => {
    return baseRows.map((row, idx) => {
      const edits = editedCells[idx]
      if (!edits) return row
      return { ...row, ...edits }
    })
  }, [baseRows, editedCells])

  return {
    outputRows,
    selectedRows,
    hasData: rawRows.length > 0,
    loadCSV,
    toggleRow,
    setAllSelected,
    editCell,
    reset,
  }
}
