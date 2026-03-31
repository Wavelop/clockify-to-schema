# Ore Export

PWA per trasformare export CSV di Clockify in file Excel formattati, tramite un sistema di schemi configurabili.

## Funzionalità

- **Schemi configurabili** — definisci colonne di output, mapping per utente, valori statici e trasformazioni
- **Import CSV** — trascina un CSV Clockify (summary o detailed) per caricare i dati
- **Anteprima editabile** — modifica le celle prima dell'export; dropdown per campi a scelta multipla
- **Ordinamento colonne** — click sulle intestazioni per ordinare asc/desc
- **Export XLSX** — genera un file Excel con le colonne dello schema
- **Persistenza** — stato (CSV, selezioni, modifiche) salvato in IndexedDB via Dexie con ripristino automatico
- **Dark mode** — toggle con persistenza
- **PWA** — installabile, funziona offline dopo la prima visita

## Stack tecnico

| Tool | Versione |
|------|----------|
| Vite | ^8 |
| React + TypeScript | ^19 / ^6 |
| Tailwind CSS | ^4 |
| Radix UI | vari |
| Dexie (IndexedDB) | ^4 |
| SheetJS (xlsx) | ^0.18 |
| vite-plugin-pwa | ^1 |

## Avvio locale

```bash
npm install
npm run dev
```

Apri [http://localhost:5175](http://localhost:5175)

> In un container Docker assicurati di esporre la porta: `-p 5175:5175`

## Comandi

```bash
npm run dev           # Dev server su 0.0.0.0:5175
npm run build         # TypeScript check + Vite build
npm run preview       # Preview build di produzione
npm run deploy        # Build e deploy su GitHub Pages
npm run generate-icons  # Rigenera le icone PWA in public/
```

## Struttura del progetto

```
src/
├── components/
│   ├── ui/             # Componenti base (Button, Card, Input, ...)
│   ├── CsvDropzone.tsx
│   ├── PreviewTable.tsx
│   ├── SchemaList.tsx
│   └── SchemaView.tsx
├── hooks/
│   └── use-import.ts   # Caricamento CSV, trasformazione, selezione righe
├── lib/
│   ├── csv.ts          # Parsing CSV
│   ├── transform.ts    # Applicazione schema alle righe
│   ├── export.ts       # Scrittura XLSX
│   └── db.ts           # Schema Dexie e persistenza
├── schemas/
│   ├── index.ts        # Registro schemi
│   └── *.ts            # Definizione dei singoli schemi
├── types/
│   └── schema.ts       # Tipi TypeScript (Schema, ColumnDef, SortState)
└── App.tsx
```

## Aggiungere uno schema

Crea un file in `src/schemas/` e registralo in `src/schemas/index.ts`. Vedi [doc/schema.md](doc/schema.md) per la documentazione completa.

## Licenza

MIT
