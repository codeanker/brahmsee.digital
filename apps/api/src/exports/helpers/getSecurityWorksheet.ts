/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import dayjs from 'dayjs'

interface exportAccount {
  person: {
    firstname: string
    lastname: string
  }
}

export function getSecurityWorksheet(XLSX, account: exportAccount, countDataEntries: number) {
  const securityWorksheet = XLSX.utils.json_to_sheet([
    { '': 'Sicherheit' },
    { '': '' },
    { '': 'Diese Datei wurde automatisch generiert und aus brahmsee.digital exportiert.' },
    { '': 'Die Daten sind vertraulich und dürfen nicht an Dritte weitergegeben werden.' },
    { '': '' },
    { '': 'Anzahl Datensätze ' + countDataEntries },
    { '': 'Erstellt von: ' + account.person.firstname + ' ' + account.person.lastname },
    { '': 'Erstellt am: ' + dayjs().format('DD.MM.YYYY HH:mm') },
  ])

  securityWorksheet['!protect'] = {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: true,
    formatColumns: true,
    formatRows: true,
    insertRows: true,
    insertColumns: true,
    insertHyperlinks: true,
    deleteRows: true,
    deleteColumns: true,
    sort: true,
    autoFilter: true,
    pivotTables: true,
  }

  return { securityWorksheet, securityWorksheetName: 'Sicherheit' }
}
