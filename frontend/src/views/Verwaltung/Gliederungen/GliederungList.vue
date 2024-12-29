<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import GenericDataGrid from '@/components/GenericDataGrid.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import router from '@/router'
import { type RouterInput, type RouterOutput } from '@codeanker/api'
import { type TGridColumn } from '@codeanker/datagrid'

const { setTitle } = useRouteTitle()
setTitle('Gliederungen')

/// Typen von den Daten, Filter und Sortierung
type TData = Awaited<RouterOutput['gliederung']['list']>[number]
type TFilter = RouterInput['gliederung']['list']['filter']
type TOrderBy = RouterInput['gliederung']['list']['orderBy']

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'edv',
    title: 'EDV',
    filter: { component: BasicInput, key: 'name' },
    sortable: true,
  },
  {
    field: 'name',
    title: 'Gliederung',
    filter: { component: BasicInput, key: 'name' },
    sortable: true,
  },
]

/// useGrid und useFeathersGrid composable zum fetchen
async function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TFilter,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  orderBy: TOrderBy
): Promise<TData[]> {
  return apiClient.gliederung.list.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}
async function fetchCount(filter: TFilter): Promise<number> {
  return apiClient.gliederung.count.query({
    filter: filter,
  })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten einer Gliederung die entsprechende Zeile anklicken.</p>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Gliederung Erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
        Gliederung erstellen
      </RouterLink>
    </div>
    <div class="flow-root">
      <div class="w-full h-[80vh]">
        <GenericDataGrid
          :columns="columns"
          :fetch-page="fetchPage"
          :fetch-count="fetchCount"
          :default-filter="{
            edv: '',
            name: '',
          }"
          :default-order-by="[['name', 'asc']]"
          no-data-message="Es gibt bisher keine Anmeldungen."
          show-clickable
          @row-click="
            (gliederung) =>
              router.push({ name: 'Verwaltung Gliederungsdetails', params: { gliederungId: gliederung.id } })
          "
        />
      </div>
    </div>
  </div>
</template>
