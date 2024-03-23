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
  hasOptions?: boolean
}

export const CustomFields: CustomField[] = [
  { name: 'BasicInput' },
  { name: 'BasicTextArea' },
  { name: 'BasicEditor' },
  { name: 'BasicSwitch' },
  { name: 'BasicCheckbox' },
  { name: 'BasicInputNumber' },
  { name: 'BasicRadio', hasOptions: true },
  { name: 'BasicSelect', hasOptions: true },
  { name: 'BasicDropdown', hasOptions: true },
]

export const CustomFieldsMapping = CustomFields.map((field) => ({
  label: field.name,
  value: field.name,
  disabled: false,
}))
