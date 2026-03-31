import { ArrowRight, FileSpreadsheet } from 'lucide-react'
import type { Schema } from '../types/schema'

interface SchemaListProps {
  schemas: Schema[]
  onSelect: (schemaId: string) => void
}

export function SchemaList({ schemas, onSelect }: SchemaListProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Piani di esportazione</h1>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Seleziona un piano per importare un CSV Clockify ed esportare in Excel.
        </p>
      </div>

      {schemas.length === 0 ? (
        <div
          className="rounded-xl border p-8 text-center"
          style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
        >
          Nessun piano disponibile. Aggiungine uno in{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">src/schemas/</code>.
        </div>
      ) : (
        <div className="grid gap-3">
          {schemas.map(schema => (
            <button
              key={schema.id}
              onClick={() => onSelect(schema.id)}
              className="flex items-center gap-4 rounded-xl border p-4 text-left transition-colors hover:bg-muted group"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                <FileSpreadsheet className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base">{schema.name}</p>
                {schema.description && (
                  <p className="text-sm mt-0.5 truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {schema.description}
                  </p>
                )}
              </div>
              <ArrowRight
                className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                style={{ color: 'hsl(var(--muted-foreground))' }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
