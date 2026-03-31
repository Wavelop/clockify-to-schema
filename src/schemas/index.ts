import type { Schema } from '../types/schema'
import { wavelopSchema } from './wavelop'
import { wavelopDetailedSchema } from './wavelop-detailed'

export const schemas: Schema[] = [
  wavelopSchema,
  wavelopDetailedSchema,
]

export function getSchema(id: string): Schema | undefined {
  return schemas.find(s => s.id === id)
}
