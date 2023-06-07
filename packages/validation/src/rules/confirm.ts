import { defineRule } from '../defineRule'

export function confirm(comparingValue?: string) {
  return defineRule((value, context) => {
    const valid = value === comparingValue
    return valid || `Das Feld ${context.name} ist nicht gleich`
  })
}
