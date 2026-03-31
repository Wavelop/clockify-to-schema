import type { Schema } from '../types/schema'

/**
 * Apply a schema to parsed CSV rows, producing output rows keyed by column.key.
 * Value resolution priority per column:
 *   1. userMapping[row[userKeySource]] if userMapping is set
 *   2. row[source] if source is set
 *   3. default
 *   4. ''
 * Then applies transform() if defined.
 */
export function applySchema(
  rows: Record<string, string>[],
  schema: Schema
): Record<string, string>[] {
  const userKey = schema.userKeySource ?? 'User'

  return rows.map(row => {
    const out: Record<string, string> = {}
    for (const col of schema.outputColumns) {
      let value = ''

      if (col.userMapping) {
        const user = row[userKey] ?? ''
        value = col.userMapping[user] ?? col.default ?? ''
      } else if (col.source) {
        value = row[col.source] ?? col.default ?? ''
      } else {
        value = col.default ?? ''
      }

      if (col.transform) {
        value = col.transform(value, row)
      }

      out[col.key] = value
    }
    return out
  })
}
