<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import DataTable, { type Query } from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { type RouterOutput } from '@codeanker/api'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { dayjs, formatDateWith } from '@codeanker/helpers'
import { useRouter } from 'vue-router'
import { h } from 'vue'

const router = useRouter()

const { setTitle } = useRouteTitle()
setTitle('Veranstaltungen')

type Veranstaltung = RouterOutput['veranstaltung']['verwaltungList']['data'][number]

const keyInfoDateFormat = 'dddd, DD. MMMM YYYY'
const column = createColumnHelper<Veranstaltung>()
const columns = [
  column.accessor('name', {
    header: 'Name',
  }),
  column.display({
    header: 'Zeitraum',
    cell({ row }) {
      return `${formatDateWith(row.original.beginn, keyInfoDateFormat)} - ${formatDateWith(row.original.ende, keyInfoDateFormat)}`
    },
    enableColumnFilter: false,
  }),
  column.accessor('meldeschluss', {
    header: 'Meldeschluss',
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
    header: 'Teilnahmegebühr',
    cell({ getValue }) {
      const value = getValue<number>()
      return value + ' €'
    },
    enableColumnFilter: false,
  }),
  column.accessor('maxTeilnehmende', {
    header: 'Max. TN',
    enableColumnFilter: false,
  }),
]

const query: Query<Veranstaltung> = (pagination, filter) =>
  useQuery({
    queryKey: ['veranstaltung', pagination, filter],
    queryFn: () =>
      apiClient.veranstaltung.verwaltungList.query({
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
      }),
    initialData,
    placeholderData: keepPreviousData,
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
      :query="query"
      :columns="columns"
      @dblclick="onClick"
    />
  </div>
</template>
