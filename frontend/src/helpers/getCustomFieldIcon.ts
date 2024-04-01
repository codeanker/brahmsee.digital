import textarea from '@/assets/images/icons/CustomFields/align-left-regular.svg'
import radio from '@/assets/images/icons/CustomFields/circle-dot-regular.svg'
import numberinput from '@/assets/images/icons/CustomFields/input-numeric-regular.svg'
import inputPipe from '@/assets/images/icons/CustomFields/input-pipe-regular.svg'
import input from '@/assets/images/icons/CustomFields/input-text-regular.svg'
import checkbox from '@/assets/images/icons/CustomFields/square-check-regular.svg'
import dropdown from '@/assets/images/icons/CustomFields/square-chevron-down-regular.svg'
import toggle from '@/assets/images/icons/CustomFields/toggle-on-regular.svg'
import { type CustomFieldType } from '@codeanker/api'

export const getCustomFieldIcon = (fieldType: CustomFieldType) => {
  switch (fieldType) {
    case 'BASIC_INPUT':
      return input
    case 'BASIC_TEXT_AREA':
      return textarea
    case 'BASIC_EDITOR':
      return input
    case 'BASIC_SWITCH':
      return toggle
    case 'BASIC_INPUT_NUMBER':
      return numberinput
    case 'BASIC_RADIO':
      return radio
    case 'BASIC_SELECT':
      return dropdown
    case 'BASIC_CHECKBOX':
      return checkbox
    case 'BASIC_DROPDOWN':
      return dropdown

    default:
      return inputPipe
  }
}
