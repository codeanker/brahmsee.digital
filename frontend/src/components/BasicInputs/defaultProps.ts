import { type RuleFunction, type RequiredRulesParams } from '@codeanker/core-validation'

export type BasicInputDefaultProps<TModelValue> = {
  id?: string
  label?: string
  name?: string
  modelValue: TModelValue | undefined
  rules?: RuleFunction[]
  required?: RequiredRulesParams
  placeholder?: string
  disabled?: boolean
}
