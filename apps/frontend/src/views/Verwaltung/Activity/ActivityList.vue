<script setup lang="ts">
import { apiClient } from '@/api'
import DataTable, { type Query } from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import Badge from '@/components/UIComponents/Badge.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import type { StatusColors } from '@/helpers/getAnmeldungStatusColors'
import router from '@/router'
import { type Activity, type ActivityType } from '@codeanker/api'
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
    meta: {
      filter: {
        type: 'date-range',
      },
    },
    cell({ getValue }) {
      const value = getValue<Date>()
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
    meta: {
      filter: {
        type: 'select',
        options: async () => {
          const values = await apiClient.activity.listSubjectTypes.query()
          return values.map((v) => ({ value: v, label: v }))
        },
      },
    },
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
    initialData,
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
