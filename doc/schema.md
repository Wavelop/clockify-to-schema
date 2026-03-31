# Come scrivere uno schema

Uno schema definisce come trasformare le righe di un CSV Clockify in colonne di output per l'export Excel.

## Struttura base

Crea un file in `src/schemas/mio-schema.ts`:

```ts
import type { Schema } from '../types/schema'

export const mioSchema: Schema = {
  id: 'mio-schema',          // identificatore univoco, usato per la persistenza
  name: 'Nome visibile',     // mostrato nella lista schemi
  description: 'Descrizione breve',
  inputFormat: 'summary',    // 'summary' o 'detailed'
  inputDelimiter: ',',       // delimitatore CSV (default: ',')
  userKeySource: 'User',     // colonna CSV che identifica l'utente (default: 'User')
  outputColumns: [ /* ... */ ],
}
```

Poi registralo in `src/schemas/index.ts`:

```ts
import { mioSchema } from './mio-schema'

export const schemas: Schema[] = [
  wavelopSchema,
  mioSchema,   // aggiungi qui
]
```

---

## Definire le colonne (`outputColumns`)

Ogni elemento di `outputColumns` è un `ColumnDef`. Per ogni riga del CSV viene prodotto un valore secondo questa priorità:

```
userMapping[utente] → row[source] → default → ''
```

Poi viene applicato `transform`, se presente.

### Copia diretta da CSV

```ts
{ key: 'data', label: 'Data', source: 'Date' }
```

`source` è il nome esatto dell'header nel CSV di input.

### Valore statico

```ts
{ key: 'tipo_ore', label: 'Tipo Ore', default: 'Fatturabile' }
```

Tutte le righe avranno lo stesso valore.

### Valore per utente (`userMapping`)

```ts
{
  key: 'attivita',
  label: 'Attività',
  userMapping: {
    'Mario Rossi': 'Consulenza',
    'Anna Bianchi': 'Sviluppo',
  },
}
```

La chiave del mapping è il valore della colonna indicata in `userKeySource` (default: `User`). Se l'utente non è nel mapping, cade su `default` o stringa vuota.

`userMapping` ha precedenza su `source`: se li usi entrambi, `source` viene ignorato.

### Cella modificabile dall'utente

```ts
{ key: 'note', label: 'Note', editable: true, default: '' }
```

La cella compare editabile nella tabella di anteprima. Utile per campi che l'utente deve riempire manualmente riga per riga.

### Trasformazione del valore

```ts
{
  key: 'ore',
  label: 'Ore',
  source: 'Time (decimal)',
  transform: (value, row) => value.replace('.', ','),
}
```

`transform` riceve il valore già risolto e l'intera riga CSV originale. Può restituire qualsiasi stringa.

Esempio più complesso che usa altri campi della riga:

```ts
{
  key: 'descrizione',
  label: 'Descrizione',
  transform: (_value, row) => `${row['Project']} – ${row['Description']}`,
}
```

---

## Esempio completo

```ts
import type { Schema } from '../types/schema'

export const acmeSchema: Schema = {
  id: 'acme',
  name: 'Acme Srl',
  description: 'Clockify Summary → foglio ore Acme',
  inputFormat: 'summary',
  userKeySource: 'User',
  outputColumns: [
    {
      key: 'data',
      label: 'Data',
      source: 'Date',
    },
    {
      key: 'utente',
      label: 'Utente',
      source: 'User',
    },
    {
      key: 'codice',
      label: 'Codice commessa',
      userMapping: {
        'Mario Rossi': 'ACME-001',
        'Anna Bianchi': 'ACME-002',
      },
    },
    {
      key: 'ore',
      label: 'Ore',
      source: 'Time (decimal)',
      transform: (v) => v.replace('.', ','),
    },
    {
      key: 'note',
      label: 'Note',
      editable: true,
      default: '',
    },
  ],
}
```
