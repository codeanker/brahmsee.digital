import { CustomFieldPosition, CustomFieldType } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const CustomFieldTypeMapping = defineEnumMapping<CustomFieldType>({
  BASIC_INPUT: { human: 'Einzeiliges Textfeld', description: 'z.B. für Vornamen oder Hobby' },
  BASIC_TEXT_AREA: { human: 'Mehrzeiliges Textfeld', description: 'z.B. für Bemerkungen' },
  BASIC_EDITOR: { human: 'Editor', description: 'z.B. für längere Texte mit Formatierungen' },
  BASIC_INPUT_NUMBER: { human: 'Einzeilges Zahlenfeld', description: 'z.B. für Schuhgröße oder Telefonnummer' },
  BASIC_SWITCH: { human: 'Switch', description: 'z.B. für einfache Ja-Nein-Fragen' },
  BASIC_CHECKBOX: { human: 'Checkbox', description: 'z.B. für einfache Ja-Nein-Fragen' },
  BASIC_RADIO: { human: 'Radio', description: 'z.B. für eine Auswahl aus mehreren Optionen' },
  BASIC_SELECT: { human: 'Select', description: 'z.B. für eine Auswahl aus mehreren Optionen' },
  BASIC_DROPDOWN: { human: 'Dropdown', description: 'z.B. für eine Auswahl aus mehreren Optionen' },
})

export { type CustomFieldType }

export const CustomFieldPositionMapping = defineEnumMapping<CustomFieldPosition>({
  PUBLIC_ANMELDUNG: { human: 'Öffentliche Anmeldung', description: 'Lorem Ipsum' },
  PUBLIC_PERSON: { human: 'Öffentliche Person', description: 'Lorem Ipsum' },
  INTERN_ANMELDUNG: { human: 'Interne Anmeldung', description: 'Lorem Ipsum' },
  INTERN_PERSON: { human: 'Interne Person', description: 'Lorem Ipsum' },
  INTERN_VERANSTALTUNG: { human: 'Interne Veranstaltung', description: 'Lorem Ipsum' },
  INTERN_AUSSCHREIBUNG: { human: 'Interne Ausschreibung', description: 'Lorem Ipsum' },
})

export { type CustomFieldPosition }
