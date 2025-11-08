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

type Pagination = z.infer<typeof zPagination>

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
export function defineTableInput<TFilter extends z.ZodRawShape>({
  filter,
}: {
  /**
   * An object representing all the supported values which can be filtered by.
   */
  filter: TFilter
}) {
  return z.strictObject({
    pagination: zPagination,
    filter: z.strictObject(filter).partial().optional(),
  })
}

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
