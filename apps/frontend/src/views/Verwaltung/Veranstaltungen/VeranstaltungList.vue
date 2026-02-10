<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import DataTable, { type Query } from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { useSSE } from '@/composables/useSSE'
import { type RouterOutput } from '@codeanker/api'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { dayjs, formatCurrency, formatDateWith } from '@codeanker/helpers'
import { useRouter } from 'vue-router'
import { h, ref } from 'vue'

const router = useRouter()

const { setTitle } = useRouteTitle()
setTitle('Veranstaltungen')

type Veranstaltung = RouterOutput['veranstaltung']['table']['data'][number]

const keyInfoDateFormat = 'dddd, DD. MMMM YYYY'
const column = createColumnHelper<Veranstaltung>()
const columns = [
  column.accessor('name', {
    header: 'Name',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  column.display({
    id: 'zeitraum',
    header: 'Zeitraum',
    enableColumnFilter: true,
    cell({ row }) {
      return `${formatDateWith(row.original.beginn, keyInfoDateFormat)} - ${formatDateWith(row.original.ende, keyInfoDateFormat)}`
    },
    meta: {
      filter: {
        type: 'date-range',
      },
    },
  }),
  column.accessor('meldeschluss', {
    header: 'Meldeschluss',
    enableColumnFilter: true,
    cell({ getValue }) {
      const value = getValue<Date>()
      const isMeldeschlussErreicht = dayjs().isAfter(value)
      return h(
        'span',
        isMeldeschlussErreicht
          ? {
              class: 'text-red-500',
            }
          : null,
        formatDateWith(value, keyInfoDateFormat)
      )
    },
    meta: {
      filter: {
        type: 'date-range',
      },
    },
  }),
  column.accessor('teilnahmegebuehr', {
    header: 'Gebühr',
    enableColumnFilter: false,
    enableSorting: true,
    cell: ({ getValue }) => formatCurrency(getValue<number>()),
  }),
  column.accessor('maxTeilnehmende', {
    header: 'Anm. / Max',
    cell: ({ row }) => `${row.original.anzahlAnmeldungen} / ${row.original.maxTeilnehmende}`,
    enableColumnFilter: false,
  }),
]

const query: Query<Veranstaltung> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['veranstaltung', pagination, filter, orderBy],
    queryFn: () =>
      apiClient.veranstaltung.table.query({
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

const dataTableRef = ref<InstanceType<typeof DataTable>>()

// Set up SSE to auto-refresh table when data changes
useSSE('veranstaltung', () => {
  console.log('Veranstaltung table updated, refreshing...')
  dataTableRef.value?.query.refetch()
})

function onClick(veranstaltung: Veranstaltung) {
  router.push({ name: 'Verwaltung Veranstaltungsdetails', params: { veranstaltungId: veranstaltung.id } })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten einer Veranstaltung die entsprechende Zeile anklicken.</p>
      </div>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Veranstaltung erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        Veranstaltung erstellen
      </RouterLink>
    </div>

    <DataTable
      ref="dataTableRef"
      :query="query"
      :columns="columns"
      :initial-sort="[{ id: 'name', desc: false }]"
      @click="onClick"
    />
  </div>
</template>
