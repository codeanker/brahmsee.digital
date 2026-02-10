import { type ComputedRef } from 'vue'

import type { RuleFieldContext, RuleFunction } from './defineRule.js'

/**
 * Executes a list of validation rules against a value.
 * Returns the first error message encountered, or true if all rules pass.
 * @param rules - A computed ref containing the array of rule functions to execute
 * @returns An async function that validates a value against all rules
 * @example
 * const validator = excecuteRules(computed(() => [required(true), emailValid]))
 * const result = await validator('test@example.com', { name: 'email' })
 * // result is true if valid, or an error message string if invalid
 */
export function excecuteRules(rules: ComputedRef<RuleFunction[]>) {
  return async (value: unknown, context: RuleFieldContext): Promise<true | string> => {
    for (const rule of rules.value) {
      const ruleValid = await rule(value, context)
      if (ruleValid !== true) return ruleValid
    }
    return true
  }
}
