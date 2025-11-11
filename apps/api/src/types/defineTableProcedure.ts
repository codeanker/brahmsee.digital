import type { Prisma } from '@prisma/client'
import { z } from 'zod'

export type QueryResponse<T> = {
  data: T[]
  total: number
  pagination: {
    page: number
    pages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

const zPagination = z
  .strictObject({
    pageIndex: z.number().min(0),
    pageSize: z.number().min(1).max(50),
  })
  .optional()

export type Pagination = z.infer<typeof zPagination>

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface OrderBy extends Record<string, Prisma.SortOrder | OrderBy> {}

/**
 * Calculates pagination data based on total items and requested pagination.
 *
 * @param total The total amount of items available.
 * @param pagination The user-requested pagination.
 * @returns Pagination options to be used with the database query.
 */
export function calculatePagination(total: number, pagination: Pagination) {
  const pageIndex = pagination?.pageIndex ?? 0
  const pageSize = pagination?.pageSize ?? 50
  const pages = Math.ceil(total / pageSize)

  return { pageIndex, pageSize, pages }
}

/**
 * Defines a common tRPC input schema structure for procedures used by the `DataTable` component.
 *
 * @returns A zod object depicting the target input schema.
 */
export function defineTableInput<TFilter extends z.ZodRawShape, TOrderBy extends [string, ...string[]]>({
  filter,
  orderBy,
}: {
  /**
   * An object representing all the supported values which can be filtered by.
   */
  filter: TFilter

  /**
   * A list of attributes which can be ordered by.
   */
  orderBy?: TOrderBy
}) {
  return z.strictObject({
    pagination: zPagination,
    filter: z.strictObject(filter).partial().optional(),
    orderBy:
      orderBy === undefined
        ? z.undefined().optional()
        : z
            .array(
              z.strictObject({
                id: z.enum(orderBy),
                desc: z.boolean(),
              })
            )
            .optional()
            .transform<OrderBy[]>((list, ctx) => {
              if (list === undefined) {
                return []
              }

              return list.map<OrderBy>(({ id, desc }, index) => {
                if (id === undefined) {
                  ctx.addIssue({
                    code: 'custom',
                    path: [...ctx.path, index],
                    fatal: true,
                    message: `encountered undefined id for orderBy operation`,
                  })
                  return {}
                }

                // the regex makes sure queries like 'anmeldungen__count' are not split into
                //     'anmeldungen', '', 'count'
                // but
                //     'anmeldungen', '_count'
                const keys = id.split(/_(?=_)/g)
                const direction: Prisma.SortOrder = desc ? 'desc' : 'asc'

                return keys.reduceRight<OrderBy>((acc, key) => ({ [key]: acc }), direction as unknown as OrderBy)
              })
            }),
  })
}

export type TableInput = z.infer<ReturnType<typeof defineTableInput>>

/**
 * Defines a generic query response for consumption with the `DataTable` component.
 *
 * @returns An object which depicts the result of a table procedure.
 */
export function defineQueryResponse<T>({
  data,
  total,
  pagination: { pageIndex, pages },
}: {
  data: T[]
  total: number
  pagination: ReturnType<typeof calculatePagination>
}) {
  return {
    data,
    total,
    pagination: {
      page: pageIndex,
      pages,
      hasNextPage: pageIndex < pages - 1,
      hasPreviousPage: pageIndex > 0,
    },
  }
}

export function defineEmptyQueryResponse() {
  return defineQueryResponse({
    data: [],
    total: 0,
    pagination: {
      pageIndex: 0,
      pages: 0,
      pageSize: 0,
    },
  })
}
