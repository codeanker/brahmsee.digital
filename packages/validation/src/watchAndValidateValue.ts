import { useField } from 'vee-validate'
import { ComputedRef, unref, watch } from 'vue'
import { excecuteRules } from './executeRules'
import { RuleFunction } from './defineRule'

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
