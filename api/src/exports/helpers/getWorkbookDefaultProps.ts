interface exportAccount {
  person: {
    firstname: string
    lastname: string
  }
}

/**
 * Returns Default Props for a Workbook
 * @param account
 * @returns Default Props for a Workbook as an Object
 */
export function getWorkbookDefaultProps(account: exportAccount) {
  return {
    Author: account.person.firstname + ' ' + account.person.lastname,
    Manager: 'brahmsee.digital',
    Comments: 'Diese Datei wurde automatisch generiert und aus brahmsee.digital exportiert.',
    CreatedDate: new Date(),
  }
}
