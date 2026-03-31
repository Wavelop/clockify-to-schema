import { useState, useCallback, useEffect, useRef } from 'react'
import { ArrowLeft, Sun, Moon } from 'lucide-react'
import { PWAInstallPrompt } from './components/PWAInstallPrompt'
import { SchemaList } from './components/SchemaList'
import { SchemaView } from './components/SchemaView'
import { Button } from './components/ui/button'
import { getDarkMode, setDarkMode } from './lib/db'
import { schemas, getSchema } from './schemas/index'

// ─── Routing ──────────────────────────────────────────────────────────────────

type AppView = 'list' | 'schema'

const BASE = ''

function parsePath(pathname: string): { view: AppView; schemaId: string | null } {
  let path = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname
  if (!path || path === '/') return { view: 'list', schemaId: null }

  const match = path.match(/^\/([^/]+)\/?$/)
  if (match) {
    const id = match[1]
    if (getSchema(id)) return { view: 'schema', schemaId: id }
  }

  return { view: 'list', schemaId: null }
}

function buildUrl(view: AppView, schemaId?: string | null): string {
  if (view === 'list') return `${BASE}/`
  return `${BASE}/${schemaId}`
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [darkMode, setDarkModeState] = useState(getDarkMode)
  const [wideMode, setWideMode] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const [{ view, schemaId }, setRoute] = useState(() => parsePath(window.location.pathname))

  const activeSchema = schemaId ? getSchema(schemaId) ?? null : null

  const navigateTo = useCallback((newView: AppView, opts?: { schemaId?: string }) => {
    const sid = opts?.schemaId ?? null
    setRoute({ view: newView, schemaId: newView === 'schema' ? sid : null })
    window.history.pushState(null, '', buildUrl(newView, sid))
  }, [])

  // Sync on browser back/forward
  useEffect(() => {
    const handler = () => setRoute(parsePath(window.location.pathname))
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    setDarkMode(darkMode)
  }, [darkMode])

  const inSchema = view === 'schema' && activeSchema !== null

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }}
    >
      {/* ── Header ── */}
      <header
        className="sticky top-0 z-40 border-b"
        style={{
          backgroundColor: 'hsl(var(--background))',
          borderColor: 'hsl(var(--border))',
          paddingTop: 'env(safe-area-inset-top)',
        }}
      >
        <div className="max-w-[1080px] mx-auto px-3 h-14 flex items-center gap-2">

          {/* Left: back or logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {inSchema ? (
              <button
                onClick={() => navigateTo('list')}
                className="p-1.5 -ml-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Torna all'elenco"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <div
                className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center cursor-pointer"
                onClick={() => navigateTo('list')}
              >
                <span className="text-white font-bold text-xs">O</span>
              </div>
            )}
          </div>

          {/* Center: title */}
          <div className="flex-1 min-w-0" ref={menuRef}>
            {view === 'list' && (
              <span className="font-bold text-base">Ore Export</span>
            )}
            {inSchema && activeSchema && (
              <span className="font-semibold text-sm truncate">{activeSchema.name}</span>
            )}
          </div>

          {/* Right: dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkModeState(d => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

        </div>
      </header>

      {/* ── Main content ── */}
      <main className={`${wideMode ? '' : 'max-w-[1080px] mx-auto'} px-4 py-6 pb-8`}>
        {view === 'list' && (
          <SchemaList
            schemas={schemas}
            onSelect={id => navigateTo('schema', { schemaId: id })}
          />
        )}

        {inSchema && activeSchema && (
          <SchemaView schema={activeSchema} wideMode={wideMode} onToggleWideMode={() => setWideMode(w => !w)} />
        )}
      </main>

      {/* ── PWA install prompt ── */}
      <PWAInstallPrompt />
    </div>
  )
}
