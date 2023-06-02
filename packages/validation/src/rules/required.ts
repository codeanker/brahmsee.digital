import { defineRule } from '../defineRule'

export type RequiredRulesParams = boolean | { allowFalse: boolean }
export function required(params: RequiredRulesParams) {
  return defineRule((value, context) => {
    const allowFalse = typeof params !== 'boolean' && params.allowFalse

    const valid = value !== '' && value !== null && value !== undefined && (allowFalse || value !== false)

    return valid || `Das Feld ${context.name} ist ein Pflichtfeld`
  })
}
