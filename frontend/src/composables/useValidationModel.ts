import { computed } from 'vue'

import { type RuleFunction, watchAndValidateValue } from '@codeanker/validation'
import { required } from '@codeanker/validation/rules'

export default function useValidationModel<T = unknown>(
  props: {
    id?: string
    name?: string
    label?: string
    rules?: RuleFunction[]
    required?: Parameters<typeof required>[0]
    modelValue: T
  },
  emit: (name: 'update:modelValue', ...args: any[]) => void
) {
  const fieldName = getFieldName(props)

  // add required to rules if it is a param
  const rules = computed(() => {
    const rules = props.rules ?? []
    if (props.required !== undefined) rules.push(required(props.required))
    return rules
  })

  const { errorMessage, meta } = watchAndValidateValue(() => props.modelValue, fieldName, rules)

  // two way binding for the v-model
  const model = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      emit('update:modelValue', val)
    },
  })
  return {
    model,
    errorMessage,
    valid: meta.valid,
    dirty: meta.dirty,
  }
}

function getFieldName(field: { id?: string; name?: string; label?: string }): string {
  if (field.name === undefined && field.label === undefined)
    console.warn("Field has no name or label but it's required for the error message")

  if (field.id !== undefined && field.id !== '') return field.id
  else if (field.name !== undefined && field.name !== '') return field.name
  else if (field.label !== undefined && field.label !== '') return field.label
  else return 'Field ' + Math.random().toString(16)
}
