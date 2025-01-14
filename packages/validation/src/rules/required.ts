import { defineRule } from '../defineRule.js'

export type RequiredRulesParams = boolean | { allowFalse: boolean }
export function required(params: RequiredRulesParams) {
  return defineRule((value, context) => {
    const allowFalse = typeof params !== 'boolean' && params.allowFalse

    const valid =
      params === false || (value !== '' && value !== null && value !== undefined && (allowFalse || value !== false))

    return valid || `Das Feld ${context.name} ist ein Pflichtfeld`
  })
}
