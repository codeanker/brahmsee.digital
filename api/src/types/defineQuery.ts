import z from 'zod'

export const ZPaginationSchema = z.strictObject({
  skip: z.number().optional(),
  take: z.number().max(100).optional(),
})

export type TQueryPagination = z.infer<typeof ZPaginationSchema>

export const defineQuery = <TFilter extends z.AnyZodObject>({ filter }: { filter: TFilter }) =>
  z.strictObject({
    pagination: ZPaginationSchema,
    filter: filter,
  })

export interface TQuery {
  pagination: {
    take: number
    skip: number
  }
  groupBy?: Record<string, string>
  sortBy?: Record<string, string>
  filter: Record<string, unknown>
}
