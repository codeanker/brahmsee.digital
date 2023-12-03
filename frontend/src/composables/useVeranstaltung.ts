import { useAsyncState } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '../api'

export function useVeranstaltung() {
  const route = useRoute()

  watch(
    () => route.params.veranstaltungId,
    () => {
      if (route.params.veranstaltungId === undefined) return
      veranstaltung.value = null
      execute()
    }
  )

  const {
    state: veranstaltung,
    execute,
    isLoading,
  } = useAsyncState(async () => {
    return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(route.params.veranstaltungId as string) })
  }, null)
  return {
    veranstaltung,
    isLoading,
  }
}
