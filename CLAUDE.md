# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server at 0.0.0.0:5175
npm run build        # TypeScript check + Vite build (also runs generate-icons as prebuild)
npm run preview      # Preview production build
npm run deploy       # Build and deploy to GitHub Pages
npm run generate-icons  # Regenerate PWA icons in public/
```

There are no test commands — this project has no test suite.

## Architecture

**Ore Export** is a PWA for transforming Clockify CSV time-tracking exports into formatted Excel files using a schema-based pipeline.

### Core Data Flow

1. User drops a CSV file on `CsvDropzone` → raw CSV is parsed in `lib/csv.ts`
2. `useImport` hook applies the active schema via `lib/transform.ts`, producing transformed rows
3. `PreviewTable` renders editable rows; edits are tracked as cell overrides
4. User exports via `lib/export.ts` which writes an XLSX workbook

State (raw CSV, cell overrides, selected rows) is automatically persisted to IndexedDB via Dexie (`lib/db.ts`) with a 500ms debounce and restored on schema selection.

### Schema System

Schemas live in `src/schemas/` and are registered in `src/schemas/index.ts`. Each schema is a `Schema` object (see `src/types/schema.ts`) with an array of `ColumnDef` entries describing how to map input CSV columns to output columns:

- `source`: source CSV header to read from
- `default`: fallback value if source is absent
- `transform`: post-process function applied to the value
- `userMapping`: per-user lookup table (e.g. different billing codes per person)
- `editable`: marks the cell as inline-editable in the preview

To add a new schema, create a file in `src/schemas/`, define the `Schema` object, and add it to the registry in `src/schemas/index.ts`.

### Routing

There is no router library. `App.tsx` manages two views (`SchemaList` → `SchemaView`) via local state. `SchemaList` is the home screen; selecting a schema renders `SchemaView`.

### Styling

Tailwind CSS 4 via `@tailwindcss/vite` plugin. Base UI components in `src/components/ui/` follow shadcn conventions using Radix UI primitives. Theme colors are CSS custom properties (HSL) in `src/index.css`. Dark mode is toggled via a class on `<html>` and persisted to localStorage.

### Path Alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).
