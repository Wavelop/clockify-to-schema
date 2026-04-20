import type { Schema } from '../types/schema'
import { wavelopSchema } from './wavelop'
import { wavelopDetailedSchema } from './wavelop-detailed'
import { esternoSchema } from './esterno'

export const schemas: Schema[] = [
  wavelopSchema,
  wavelopDetailedSchema,
  esternoSchema,
]

export function getSchema(id: string): Schema | undefined {
  return schemas.find(s => s.id === id)
}
