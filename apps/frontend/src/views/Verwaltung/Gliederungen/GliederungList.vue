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

const { setTitle } = useRouteTitle()
setTitle('Gliederungen')

type Gliederung = RouterOutput['gliederung']['list']['data'][number]

const column = createColumnHelper<Gliederung>()
const columns = [
  column.accessor('name', {
    header: 'Name',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  column.accessor('edv', {
    header: 'EDV Nummer',
    enableColumnFilter: true,
    enableSorting: true,
  }),
]

const query: Query<Gliederung> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['gliederung', pagination, filter, orderBy],
    queryFn: () =>
      apiClient.gliederung.list.query({
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
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten einer Gliederung die entsprechende Zeile anklicken.</p>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Gliederung Erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        Gliederung erstellen
      </RouterLink>
    </div>

    <DataTable
      :query="query"
      :columns="columns"
      :initial-sort="[{ id: 'name', desc: false }]"
    />
  </div>
</template>
