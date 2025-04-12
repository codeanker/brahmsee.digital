<script setup lang="ts">
import { apiClient } from '@/api'
import DataTable, { type Query } from '@/components/Table/DataTable.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import type { StatusColors } from '@/helpers/getAnmeldungStatusColors'
import router from '@/router'
import { type ActivityType, type Activity } from '@codeanker/api'
import { formatDateWith } from '@codeanker/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'

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

const column = createColumnHelper<Activity>()
const columns = [
  column.accessor('createdAt', {
    header: 'Zeitstempel',
    maxSize: 50,
    enableColumnFilter: false,
    cell({ getValue }) {
      const value = getValue<string>()
      return formatDateWith(value, 'dddd, DD. MMMM YYYY [um] HH:mm [Uhr]')
    },
  }),
  column.accessor('description', {
    header: 'Beschreibung',
    enableColumnFilter: false,
  }),
  column.accessor('type', {
    header: 'Typ',
    meta: {
      filter: {
        type: 'select',
        options: [
          { label: 'Erstellt', value: 'CREATE' },
          { label: 'Aktualisiert', value: 'UPDATE' },
          { label: 'Gelöscht', value: 'DELETE' },
          { label: 'Sonstiges', value: 'OTHER' },
          { label: 'E-Mail', value: 'EMAIL' },
        ],
      },
    },
    cell: ({ getValue }) => {
      const value = getValue<ActivityType>()
      return h(Badge, {
        color: colorFromType(value),
        text: value,
      })
    },
  }),
  column.accessor('subjectType', {
    header: 'Betroffen',
  }),
  column.accessor('causerId', {
    header: 'Akteur',
    enableColumnFilter: false,
  }),
]

const query: Query<Activity> = (pagination, filter) =>
  useQuery({
    queryKey: ['activity', pagination, filter],
    queryFn: () =>
      apiClient.activity.list.query({
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
    initialData: {
      data: [],
      total: 0,
      pagination: {
        page: 0,
        pages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    },
    placeholderData: keepPreviousData,
  })
</script>

<template>
  <p class="max-w-2xl text-sm text-gray-500 mb-6">
    In der Verwaltung werden Aktivitäten aufgezeichnet, z.B. wenn Accounts erstellt oder gelöscht werden.
  </p>

  <DataTable
    :query="query"
    :columns="columns"
    @click="onClick"
  />
</template>
