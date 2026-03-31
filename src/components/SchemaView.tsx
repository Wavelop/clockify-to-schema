import { Download, Trash2, Maximize2, Minimize2 } from 'lucide-react'
import type { Schema } from '../types/schema'
import { useImport } from '../hooks/use-import'
import { exportToXLSX } from '../lib/export'
import { CsvDropzone } from './CsvDropzone'
import { PreviewTable } from './PreviewTable'
import { Button } from './ui/button'

interface SchemaViewProps {
  schema: Schema
  wideMode?: boolean
  onToggleWideMode?: () => void
}

export function SchemaView({ schema, wideMode, onToggleWideMode }: SchemaViewProps) {
  const {
    outputRows,
    selectedRows,
    hasData,
    loadCSV,
    toggleRow,
    setAllSelected,
    editCell,
    reset,
  } = useImport(schema)

  const selectedCount = selectedRows.size
  const selectedOutputRows = outputRows.filter((_, idx) => selectedRows.has(idx))

  const handleExport = () => {
    const date = new Date().toISOString().slice(0, 10)
    exportToXLSX(selectedOutputRows, schema.outputColumns, `${schema.id}_${date}`)
  }

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-bold">{schema.name}</h2>
          {schema.description && (
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {schema.description}
            </p>
          )}
        </div>

        {hasData && (
          <div className="flex items-center gap-2">
            {onToggleWideMode && (
              <Button variant="ghost" size="icon" onClick={onToggleWideMode} title={wideMode ? 'Riduci larghezza' : 'Espandi larghezza'}>
                {wideMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={reset} title="Rimuovi il CSV caricato">
              <Trash2 className="h-4 w-4 mr-1.5" />
              Svuota
            </Button>
            <Button
              size="sm"
              onClick={handleExport}
              disabled={selectedCount === 0}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Esporta {selectedCount > 0 ? `(${selectedCount})` : ''}
            </Button>
          </div>
        )}
      </div>

      {/* Upload zone or preview */}
      {!hasData ? (
        <CsvDropzone onFile={loadCSV} />
      ) : (
        <div className="space-y-3">
          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {outputRows.length} righe trovate — {selectedCount} selezionate per l'export.
            Le celle con ✎ sono modificabili (clic per editare).
          </p>
          <PreviewTable
            columns={schema.outputColumns}
            rows={outputRows}
            selectedRows={selectedRows}
            defaultSort={schema.defaultSort}
            onToggleRow={toggleRow}
            onSetAllSelected={setAllSelected}
            onEditCell={editCell}
          />
        </div>
      )}
    </div>
  )
}
