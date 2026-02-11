import { defineRule } from '../defineRule.js'

/**
 * Parameters for the required validation rule.
 * Can be a boolean or an object with allowFalse option.
 */
export type RequiredRulesParams = boolean | { allowFalse: boolean }

/**
 * Creates a validation rule that checks if a field has a value.
 * By default, empty strings, null, undefined, and false are considered invalid.
 * @param params - If false, the field is not required. If true or an object, the field is required.
 *                 The object form accepts an `allowFalse` property to allow boolean false as a valid value.
 * @returns A validation rule function
 * @example
 * required(true) // Field is required, false values are invalid
 * required({ allowFalse: true }) // Field is required, but false is allowed
 * required(false) // Field is not required
 */
export function required(params: RequiredRulesParams) {
  return defineRule((value, context) => {
    const allowFalse = typeof params !== 'boolean' && params.allowFalse

    const valid =
      params === false || (value !== '' && value !== null && value !== undefined && (allowFalse || value !== false))

    return valid || `Das Feld ${context.name} ist ein Pflichtfeld`
  })
}
