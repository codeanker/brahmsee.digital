import { z } from 'zod'
import { ZOrderbySchema } from './defineQuery.js'

export function defineOrderBy<U extends string, TKeys extends Readonly<[U, ...U[]]>>(orderByConfig: TKeys) {
  return z.array(z.record(z.enum(orderByConfig), ZOrderbySchema)).optional()
}
