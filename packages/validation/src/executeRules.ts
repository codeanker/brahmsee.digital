import { type ComputedRef } from 'vue'

import type { RuleFieldContext, RuleFunction } from './defineRule.js'

export function excecuteRules(rules: ComputedRef<RuleFunction[]>) {
  return async (value: unknown, context: RuleFieldContext): Promise<true | string> => {
    for (const rule of rules.value) {
      const ruleValid = await rule(value, context)
      if (ruleValid !== true) return ruleValid
    }
    return true
  }
}
