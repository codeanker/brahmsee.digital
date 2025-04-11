import { useField } from 'vee-validate'
import { type ComputedRef, unref, watch } from 'vue'

import type { RuleFunction } from './defineRule.js'
import { excecuteRules } from './executeRules.js'

export function watchAndValidateValue(valueGetter: () => any, fieldName: string, rules: ComputedRef<RuleFunction[]>) {
  const { errorMessage, handleChange, meta, validate } = useField(fieldName, excecuteRules(rules), {
    initialValue: valueGetter(),
  })
  watch(
    () => rules.value,
    async () => {
      if (meta.validated) {
        await validate({
          mode: 'validated-only',
        })
      }
    }
  )
  watch(valueGetter, (val) => handleChange(unref(val)), { deep: true })
  return { errorMessage, meta }
}
