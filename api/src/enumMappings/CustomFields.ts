import { CustomFieldPosition, CustomFieldType, type CustomField } from '@prisma/client'

import { defineEnumMapping } from "./defineEnumMapping.js"

export { type CustomField }
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
  PUBLIC_ANMELDUNG: { human: 'Öffentliche Anmeldung', description: 'Wird bei der Anmeldung abgefagt' },
  INTERN_ANMELDUNG: { human: 'Interne Anmeldung', description: 'Wird für Admins in der Verwaltung angezeigt' },
})

export { type CustomFieldPosition }
