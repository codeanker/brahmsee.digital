import type { QueryResponse } from '@codeanker/api'

const initialData = {
  data: [],
  total: 0,
  pagination: {
    page: 0,
    pages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  },
}

export default initialData

export function defineInitialData<TData>(): QueryResponse<TData> {
  return initialData
}
