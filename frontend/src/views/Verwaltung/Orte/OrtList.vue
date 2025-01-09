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
setTitle('Orte')

/// Typen von den Daten, Filter und Sortierung
type TData = Awaited<RouterOutput['ort']['list']>[number]
type TFilter = RouterInput['ort']['list']['filter']
type TOrderBy = RouterInput['ort']['list']['orderBy']

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'id',
    title: 'Id',
    sortable: true,
  },
  {
    field: 'name',
    title: 'Name',
    filter: { component: BasicInput, key: 'name' },
    sortable: true,
  },
  {
    field: 'address.city',
    title: 'Ort',
    filter: { component: BasicInput, key: 'city' },
    sortable: true,
  },
]

async function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TFilter,
  orderBy: TOrderBy
): Promise<TData[]> {
  return apiClient.ort.list.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}
async function fetchCount(filter: TFilter): Promise<number> {
  return apiClient.ort.count.query({
    filter: filter,
  })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten eines Ortes die entsprechende Zeile anklicken.</p>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Ort erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        Ort erstellen
      </RouterLink>
    </div>
    <div class="flow-root">
      <div class="w-full h-[80vh]">
        <GenericDataGrid
          :columns="columns"
          :fetch-page="fetchPage"
          :fetch-count="fetchCount"
          :default-filter="{
            name: '',
            city: '',
          }"
          :default-order-by="[['id', 'asc']]"
          no-data-message="Es gibt bisher keine Orte."
          show-clickable
          @row-click="(ort) => router.push({ name: 'Verwaltung Ortdetails', params: { ortId: ort.id } })"
        />
      </div>
    </div>
  </div>
</template>
