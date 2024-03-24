import { CustomFieldPosition } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const CustomFieldNames = [
  'BasicInput',
  'BasicTextArea',
  'BasicEditor',
  'BasicSwitch',
  'BasicCheckbox',
  'BasicInputNumber',
  'BasicRadio',
  'BasicSelect',
  'BasicDropdown',
] as const

export type CustomFieldType = (typeof CustomFieldNames)[number]

export interface CustomField {
  name: CustomFieldType
  label: string
  hasOptions?: boolean
}

export const CustomFields: CustomField[] = [
  { name: 'BasicInput', label: 'Textfeld' },
  { name: 'BasicTextArea', label: 'Großes Textfeld' },
  { name: 'BasicEditor', label: 'Editor' },
  { name: 'BasicSwitch', label: 'Schalter' },
  { name: 'BasicCheckbox', label: 'Checkbox' },
  { name: 'BasicInputNumber', label: 'Zahlenfeld' },
  { name: 'BasicRadio', label: 'Radio Buttons', hasOptions: true },
  { name: 'BasicSelect', label: 'Select', hasOptions: true },
  { name: 'BasicDropdown', label: 'Dropdown', hasOptions: true },
]

export const CustomFieldsMapping = CustomFields.map((field) => ({
  label: field.label,
  value: field.name,
  disabled: false,
}))

export const CustomFieldPositionMapping = defineEnumMapping<CustomFieldPosition>({
  PUBLIC_ANMELDUNG: { human: 'Öffentliche Anmeldung', description: 'Lorem Ipsum' },
  PUBLIC_PERSON: { human: 'Öffentliche Person', description: 'Lorem Ipsum' },
  INTERN_ANMELDUNG: { human: 'Interne Anmeldung', description: 'Lorem Ipsum' },
  INTERN_PERSON: { human: 'Interne Person', description: 'Lorem Ipsum' },
  INTERN_VERANSTALTUNG: { human: 'Interne Veranstaltung', description: 'Lorem Ipsum' },
  INTERN_AUSSCHREIBUNG: { human: 'Interne Ausschreibung', description: 'Lorem Ipsum' },
})

export { CustomFieldPosition }
