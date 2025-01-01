<script setup lang="ts">
import { apiClient } from '@/api'
import GenericDataGrid from '@/components/GenericDataGrid.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import type { StatusColors } from '@/helpers/getAnmeldungStatusColors'
import router from '@/router'
import { type Activity, type ActivityType, type RouterInput, type RouterOutput } from '@codeanker/api'
import { type TGridColumn } from '@codeanker/datagrid'

const { setTitle } = useRouteTitle()
setTitle('Aufgezeichnete Aktivitäten')

function colorFromType(type: ActivityType): StatusColors {
  switch (type) {
    case 'CREATE':
      return 'secondary'
    case 'UPDATE':
      return 'warning'
    case 'DELETE':
      return 'danger'
    default:
      return 'muted'
  }
}

function onClick({ subjectType, subjectId }: Activity) {
  switch (subjectType) {
    case 'ort':
      router.push({
        name: 'Verwaltung Ortdetails',
        params: {
          ortId: subjectId,
        },
      })
      break
    default:
      break
  }
}

/// Typen von den Daten, Filter und Sortierung
type TData = Awaited<RouterOutput['activity']['list']>[number]
type TFilter = RouterInput['activity']['list']['filter']
type TOrderBy = RouterInput['activity']['list']['orderBy']

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'createdAt',
    title: 'Datum',
    preset: 'datetime',
  },
  {
    field: 'description',
    title: 'Beschreibung',
    format: (value) => value ?? '-',
  },
  {
    field: 'type',
    title: 'Typ',
    cell: Badge,
    cellProps: (formattedValue, row) => {
      return {
        color: colorFromType(row.content.type),
        text: row.content.type,
      }
    },
  },
  {
    field: 'subjectType',
    title: 'Betroffen',
    format: (value, row) => {
      return `${value} #${row.subjectId}`
    },
  },
  {
    field: 'causerId',
    title: 'Akteur',
    format: (value, row) => `${row.causer?.person.firstname ?? ''} ${row.causer?.person.lastname ?? ''}`,
  },
]

/// useGrid und useFeathersGrid composable zum fetchen
async function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TFilter,

  orderBy: TOrderBy
): Promise<TData[]> {
  return apiClient.activity.list.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}
async function fetchCount(filter: TFilter): Promise<number> {
  return apiClient.activity.count.query({
    filter: filter,
  })
}
</script>

<template>
  <p class="max-w-2xl text-sm text-gray-500 mb-6">
    In der Verwaltung werden Aktivitäten aufgezeichnet, z.B. wenn Accounts erstellt oder gelöscht werden.
  </p>
  <div class="flow-root">
    <div class="w-full h-[80vh]">
      <GenericDataGrid
        :columns="columns"
        :fetch-page="fetchPage"
        :fetch-count="fetchCount"
        :default-filter="{}"
        :default-order-by="[['createdAt', 'desc']]"
        no-data-message="Es gibt bisher keine Anmeldungen."
        show-clickable
        @row-click="onClick"
      />
    </div>
  </div>
</template>
