<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import GenericDataGrid from '@/components/GenericDataGrid.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import router from '@/router'
import { type RouterInput, type RouterOutput } from '@codeanker/api'
import { type TGridColumn } from '@codeanker/datagrid'
import { formatCurrency } from '@codeanker/helpers'

const { setTitle } = useRouteTitle()
setTitle('Veranstaltungen')

function formatDate(indate) {
  const date = new Date(indate)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString('de-DE', options)
}

/// Typen von den Daten, Filter und Sortierung
type TData = Awaited<RouterOutput['veranstaltung']['verwaltungList']>[number]
type TFilter = RouterInput['veranstaltung']['verwaltungList']['filter']
type TOrderBy = RouterInput['veranstaltung']['verwaltungList']['orderBy']

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'id',
    title: 'Id',
    sortable: true,
  },
  {
    field: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    field: 'beginn',
    title: 'Zeitraum',
    format: (value, row) => {
      const beginn = formatDate(value)
      const ende = formatDate(row.ende)
      return `${beginn} - ${ende}`
    },
    sortable: true,
  },
  {
    field: 'meldeschluss',
    title: 'Meldeschluss',
    preset: 'date',
    sortable: true,
  },
  {
    field: 'teilnahmegebuehr',
    title: 'Gebühr',
    size: '120px',
    sortable: true,
    format: (value) => formatCurrency(value),
  },
  {
    field: 'maxTeilnehmende',
    title: 'Anm. / Max',
    size: '150px',
    format: (value, row) => `${row.anzahlAnmeldungen} / ${value}`,
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
  return apiClient.veranstaltung.verwaltungList.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}

async function fetchCount(filter: TFilter): Promise<number> {
  return apiClient.veranstaltung.verwaltungCount.query({
    filter: filter,
  })
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
    <div class="flow-root">
      <div class="grid-rows[1fr, 50px] grid flex-grow">
        <GenericDataGrid
          :columns="columns"
          :fetch-page="fetchPage"
          :fetch-count="fetchCount"
          :default-filter="{}"
          :default-order-by="[['id', 'asc']]"
          no-data-message="Es gibt bisher keine Veranstaltungen."
          show-clickable
          @row-click="
            (veranstaltung) =>
              router.push({ name: 'Verwaltung Veranstaltungsdetails', params: { veranstaltungId: veranstaltung.id } })
          "
        />
      </div>
    </div>
  </div>
</template>
