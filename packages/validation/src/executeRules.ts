import { RuleFieldContext, RuleFunction } from './defineRule'

export function excecuteRules(rules: RuleFunction[]) {
  return async (value: unknown, context: RuleFieldContext): Promise<true | string> => {
    for (const rule of rules) {
      const ruleValid = await rule(value, context)
      if (ruleValid !== true) return ruleValid
    }
    return true
  }
}
