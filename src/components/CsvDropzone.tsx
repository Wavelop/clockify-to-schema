import { useRef, useState, useCallback } from 'react'
import { Upload, FileText } from 'lucide-react'
import { cn } from '../lib/utils'

interface CsvDropzoneProps {
  onFile: (content: string) => void
  accept?: string
}

export function CsvDropzone({ onFile, accept = '.csv' }: CsvDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const readFile = useCallback(
    (file: File) => {
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result
        if (typeof content === 'string') onFile(content)
      }
      reader.readAsText(file)
    },
    [onFile]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) readFile(file)
    },
    [readFile]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        readFile(file)
        // Reset input so same file can be re-uploaded
        e.target.value = ''
      }
    },
    [readFile]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Carica file CSV"
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      className={cn(
        'flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-colors',
        dragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
          : 'border-border hover:border-blue-400 hover:bg-muted'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
      <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
        {dragging ? (
          <FileText className="h-7 w-7 text-blue-600" />
        ) : (
          <Upload className="h-7 w-7 text-blue-600" />
        )}
      </div>
      <div className="text-center">
        <p className="font-semibold text-base">
          {dragging ? 'Rilascia il file' : 'Trascina il CSV qui'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          oppure clicca per selezionare
        </p>
      </div>
    </div>
  )
}
