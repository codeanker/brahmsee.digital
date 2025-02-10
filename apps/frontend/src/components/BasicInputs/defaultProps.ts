import { type RuleFunction } from '@codeanker/validation'
import { type RequiredRulesParams } from '@codeanker/validation/rules'

export type BasicInputDefaultProps<TModelValue> = {
  id?: string
  label?: string
  name?: string
  modelValue: TModelValue | undefined
  rules?: RuleFunction[]
  required?: RequiredRulesParams
  placeholder?: string
  disabled?: boolean
  class?: string
}
