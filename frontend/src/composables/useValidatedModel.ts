import { computed } from 'vue'
import { RuleFunction, watchAndValidateValue } from '@codeanker/validation'
import { required } from '@codeanker/validation/rules'
export default function useValidatedModel<T = unknown>(
  props: {
    name?: string
    label?: string
    rules?: RuleFunction[]
    required?: Parameters<typeof required>[0]
    modelValue?: T
  },
  emit: (name: 'update:modelValue', ...args: any[]) => void
) {
  // get fieldName
  const fieldName = props.name || props.label || 'Field ' + Math.random().toString(16)
  if (!props.name && !props.label) console.warn("Field has no name or label but it's required for the error message")

  // add required to rules if it is a param
  const rules = computed(() => {
    const rules: RuleFunction[] = []
    if (props.rules) rules.push(...props.rules)
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
