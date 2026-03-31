export interface ColumnDef {
  key: string
  label: string
  /** CSV header name to pull value from */
  source?: string
  /** Static fallback value */
  default?: string
  /**
   * Per-user value override.
   * Key = value of the CSV column identified by Schema.userKeySource (default: 'User').
   * Value = the string to use for this column when that user is the row's user.
   */
  userMapping?: Record<string, string>
  /** Whether the user can edit this cell in the preview table */
  editable?: boolean
  /** If set, the editable cell renders as a dropdown with these choices */
  options?: string[]
  /** Optional post-processing transform */
  transform?: (value: string, row: Record<string, string>) => string
}

export interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

export interface Schema {
  id: string
  name: string
  description?: string
  inputFormat: 'summary' | 'detailed'
  defaultSort?: SortState
  /** CSV delimiter for the input file. Default: ',' */
  inputDelimiter?: string
  /**
   * Which CSV column holds the user/person identifier used for userMapping lookups.
   * Default: 'User'
   */
  userKeySource?: string
  outputColumns: ColumnDef[]
}
