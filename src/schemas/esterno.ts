import type { Schema } from '../types/schema'

export const esternoSchema: Schema = {
  id: 'esterno',
  name: 'Esterno',
  description: 'Clockify Detailed → formato ore Wavelop (utenti esterni)',
  inputFormat: 'detailed',
  inputDelimiter: ',',
  userKeySource: 'User',
  defaultSort: { key: 'data', direction: 'asc' },
  outputColumns: [
    {
      key: 'commessa',
      label: 'Codice commessa',
      source: 'Project',
    },
    {
      key: 'data',
      label: 'Data',
      source: 'Start Date',
    },
    {
      key: 'utente',
      label: 'Utente',
      source: 'User',
    },
    {
      key: 'cliente',
      label: 'Cliente',
      source: 'Client',
    },
    {
      key: 'attivita',
      label: 'Attività',
      default: 'Consulenza',
    },
    {
      key: 'tipo_ore',
      label: 'Tipo Ore',
      default: 'Fatturabile',
    },
    {
      key: 'ore',
      label: 'Ore',
      source: 'Duration (decimal)',
    },
    {
      key: 'localita',
      label: 'Località',
      editable: true,
      options: ['Smartworking', 'Sede cliente'],
      transform: (_value, row) =>
        row['Task'] === 'Sede' ? 'Sede cliente' : 'Smartworking',
    },
    {
      key: 'descrizione',
      label: 'Descrizione',
      source: 'Description',
    },
    {
      key: 'costi_trasferta',
      label: 'Costi trasferta',
      editable: true,
      default: '',
    },
    {
      key: 'dettaglio',
      label: 'Dettaglio',
      editable: true,
      default: '',
      transform: (_value, row) =>
        row['Task'] === 'Sede' ? 'Forfettario in fattura' : '',
    },
  ],
}
