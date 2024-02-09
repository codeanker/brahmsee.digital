import { useField } from 'vee-validate'
import { type ComputedRef, unref, watch } from 'vue'

import type { RuleFunction } from './defineRule'
import { excecuteRules } from './executeRules'

export function watchAndValidateValue(valueGetter: () => any, fieldName: string, rules: ComputedRef<RuleFunction[]>) {
  const { errorMessage, handleChange, meta, validate } = useField(fieldName, excecuteRules(rules), {
    initialValue: valueGetter(),
  })
  watch(
    () => rules.value,
    () => {
      if (meta.validated) {
        validate({
          mode: 'validated-only',
        })
      }
    }
  )
  watch(valueGetter, (val) => handleChange(unref(val)), { deep: true })
  return { errorMessage, meta }
}
