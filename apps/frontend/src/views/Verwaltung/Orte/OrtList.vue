<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import type { Query } from '@/components/Table/DataTable.vue'
import DataTable from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { type RouterOutput } from '@codeanker/api'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { useRouter } from 'vue-router'

const { setTitle } = useRouteTitle()
setTitle('Orte')

type Ort = RouterOutput['ort']['table']['data'][number]
type Address = Ort['address']

const column = createColumnHelper<Ort>()
const columns = [
  column.accessor('name', {
    header: 'Name',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  column.accessor('address', {
    header: 'Adresse',
    cell({ getValue }) {
      const value = getValue<Address>()
      return value ? `${value.street} ${value.streetNumber}, ${value.zip} ${value.city}` : 'Keine Adresse angegeben'
    },
  }),
]

const query: Query<Ort> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['ort', pagination, filter, orderBy],
    queryFn: () =>
      apiClient.ort.table.query({
        pagination: {
          pageIndex: pagination.value.pageIndex,
          pageSize: pagination.value.pageSize,
        },
        filter: filter.value.reduce((prev, curr) => {
          return {
            ...prev,
            [curr.id]: curr.value,
          }
        }, {}),
        orderBy: orderBy.value,
      }),
    initialData,
    placeholderData: keepPreviousData,
  })

const router = useRouter()

function onClick(ort: Ort) {
  router.push({ name: 'Verwaltung Ortdetails', params: { ortId: ort.id } })
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

    <DataTable
      :query="query"
      :columns="columns"
      :initial-sort="[{ id: 'name', desc: false }]"
      @dblclick="onClick"
    />
  </div>
</template>
