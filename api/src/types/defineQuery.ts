import z from 'zod'
import { set } from 'lodash-es'

export const ZPaginationSchema = z.strictObject({
  skip: z.number().optional(),
  take: z.number().max(100).optional(),
})

export type TQueryPagination = z.infer<typeof ZPaginationSchema>

export const defineQuery = <TFilter extends z.AnyZodObject, TOrderBy extends z.ZodArray<z.AnyZodTuple>>({
  filter,
  orderBy,
}: {
  filter: TFilter
  orderBy: TOrderBy
}) => {
  return z.strictObject({
    pagination: ZPaginationSchema,
    filter: filter,
    orderBy: orderBy,
  })
}

export interface TQuery {
  pagination: {
    take: number
    skip: number
  }
  groupBy?: Record<string, string>
  sortBy?: Record<string, string>
  filter: Record<string, unknown>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOrderBy<T extends string>(orderBy: Array<[T, 'asc' | 'desc']>): Record<string, any> {
  return orderBy.map(([field, order]) => {
    const result = {} as { [key in T]: 'asc' | 'desc' }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    set(result, field, order)
    return result
  })
}
