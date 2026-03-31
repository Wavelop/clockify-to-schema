import type { Schema } from '../types/schema'

export const wavelopSchema: Schema = {
  id: 'wavelop',
  name: 'Wavelop',
  description: 'Clockify Summary → formato ore Wavelop',
  inputFormat: 'summary',
  inputDelimiter: ',',
  userKeySource: 'User',
  outputColumns: [
    {
      key: 'commessa',
      label: 'Codice commessa',
      userMapping: {
        'Matteo Granzotto': 'Coin',
        'Nicola Capovilla': 'Mannah',
      },
    },
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
      key: 'cliente',
      label: 'Cliente',
      userMapping: {
        'Matteo Granzotto': 'Coin',
        'Nicola Capovilla': 'Mannah',
      },
    },
    {
      key: 'attivita',
      label: 'Attività',
      userMapping: {
        'Matteo Granzotto': 'Consulenza',
        'Nicola Capovilla': 'Sviluppo',
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
      source: 'Time (decimal)',
    },
    {
      key: 'localita',
      label: 'Località',
      userMapping: {
        'Matteo Granzotto': 'Sede cliente',
        'Nicola Capovilla': 'Smartworking',
      },
    },
    {
      key: 'descrizione',
      label: 'Descrizione',
      editable: true,
      default: '',
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
