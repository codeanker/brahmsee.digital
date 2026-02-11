/**
 * Context object passed to validation rule functions.
 * @property name - The name of the field being validated
 */
export type RuleFieldContext = {
  name: string
}

/**
 * A validation rule function that returns true if valid, or an error message string if invalid.
 * @param value - The value to validate
 * @param context - Context information about the field being validated
 * @returns True if the validation passes, or an error message string if it fails
 */
export type RuleFunction = (value: unknown, context: RuleFieldContext) => true | string | Promise<true | string>

/**
 * Defines a validation rule function with proper type checking.
 * This is a type-safe wrapper for creating validation rules.
 * @param ruleFunction - The validation rule function to define
 * @returns The same rule function with proper typing
 * @example
 * const myRule = defineRule((value, context) => {
 *   return value === 'expected' || `${context.name} must be 'expected'`
 * })
 */
export function defineRule(ruleFunction: RuleFunction) {
  return ruleFunction
}
