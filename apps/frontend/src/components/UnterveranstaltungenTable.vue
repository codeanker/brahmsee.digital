<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import GenericDataGrid from './GenericDataGrid.vue'

import { apiClient } from '@/api'
// import DataGridVirtualList from '@/components/DataGrid/DataGridVirtualList.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import { type RouterInput, type RouterOutput } from '@codeanker/api'
import { type TGridColumn } from '@codeanker/datagrid'

const props = defineProps<{
  veranstaltungId?: number
  hideColumns?: string[]
}>()

const router = useRouter()

/// Typen von den Daten, Filter und Sortierung
type TUnterveranstaltungData = Awaited<RouterOutput['unterveranstaltung']['list']>[number]
type TUnterveranstaltungFilter = RouterInput['unterveranstaltung']['list']['filter']
type TUnterveranstaltungOrderBy = RouterInput['unterveranstaltung']['list']['orderBy']

const columns = computed<TGridColumn<TUnterveranstaltungData, TUnterveranstaltungFilter>[]>(() => {
  const columns: TGridColumn<TUnterveranstaltungData, TUnterveranstaltungFilter>[] = [
    {
      field: 'id',
      title: 'Id',
      size: '50px',
    },
    {
      field: 'veranstaltung.name',
      title: 'Veranstaltung',
      sortable: true,
    },
    {
      field: 'gliederung.name',
      title: 'Gliederung',
      filter: { component: BasicInput, key: 'gliederungName' },
    },
    {
      field: 'type',
      title: 'Typ',
      sortable: true,
    },
    {
      field: 'meldeschluss',
      title: 'Meldeschluss',
      preset: 'date',
      size: '160px',
      sortable: true,
    },
    {
      field: 'teilnahmegebuehr',
      title: 'Gebühr',
      size: '120px',
      sortable: true,
      format: (value) => `${value.toFixed(2)} €`,
    },
    {
      field: 'maxTeilnehmende',
      title: 'Anm. / Max',
      size: '150px',
      format: (value, row) => `${row._count.Anmeldung} / ${value}`,
    },
  ]
  return columns.filter((column) => !props.hideColumns?.includes(column.field))
})

/// useGrid und useFeathersGrid composable zum fetchen
async function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TUnterveranstaltungFilter,

  orderBy: TUnterveranstaltungOrderBy
): Promise<TUnterveranstaltungData[]> {
  return apiClient.unterveranstaltung.list.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}
async function fetchCount(filter: TUnterveranstaltungFilter): Promise<number> {
  return apiClient.unterveranstaltung.count.query({
    filter: filter,
  })
}
</script>

<template>
  <div class="grid-rows[1fr, 50px] grid flex-grow">
    <GenericDataGrid
      :columns="columns"
      :fetch-page="fetchPage"
      :fetch-count="fetchCount"
      :default-filter="{
        veranstaltungId: veranstaltungId,
        gliederungName: '',
      }"
      :default-order-by="[['gliederung.name', 'asc']]"
      no-data-message="Es gibt bisher keine Ausschreibungen."
      show-clickable
      @row-click="
        (row) => {
          router.push({
            name: 'UnterveranstaltungDetail',
            params: { unterveranstaltungId: row.id },
          })
        }
      "
    />
  </div>
</template>
