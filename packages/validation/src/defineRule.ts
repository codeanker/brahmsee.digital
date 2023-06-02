export type RuleFieldContext = {
  name: string
}
export type RuleFunction = (value: unknown, context: RuleFieldContext) => true | string | Promise<true | string>

export function defineRule(ruleFunction: RuleFunction) {
  return ruleFunction
}
