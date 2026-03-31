import type { Schema } from '../types/schema'

export const wavelopDetailedSchema: Schema = {
  id: 'wavelop-detailed',
  name: 'Wavelop (Detailed)',
  description: 'Clockify Detailed → formato ore Wavelop',
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
      userMapping: {
        'Matteo Granzotto': 'Consulenza',
        'Nicola Capovilla': 'Consulenza',
      },
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
      options: ['Smartworking', 'Sede cliente', 'Ufficio'],
      userMapping: {
        'Matteo Granzotto': 'Smartworking',
        'Nicola Capovilla': 'Smartworking',
      },
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
    },
  ],
}
