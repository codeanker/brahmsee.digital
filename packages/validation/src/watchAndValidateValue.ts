import { useField } from 'vee-validate'
import { unref, watch } from 'vue'
import { excecuteRules } from './executeRules'
import { RuleFunction } from './defineRule'

export function watchAndValidateValue(valueGetter: () => any, fieldName: string, rules: RuleFunction[]) {
  const { errorMessage, handleChange, meta } = useField(fieldName, excecuteRules(rules), {
    initialValue: valueGetter(),
  })
  watch(valueGetter, (val) => handleChange(unref(val)), { deep: true })
  return { errorMessage, meta }
}
