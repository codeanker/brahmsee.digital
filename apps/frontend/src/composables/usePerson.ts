import { apiClient } from '@/api'
import { useQuery } from '@tanstack/vue-query'
import { toValue, type MaybeRef } from 'vue'

export function usePersons(pagination: MaybeRef<{ page: number }>) {
  return useQuery({
    queryKey: ['person', 'list', pagination],
    queryFn: () => {
      return apiClient.person.list.query({
        filter: {},
        orderBy: [],
        pagination: toValue(pagination),
      })
    },
  })
}
