<script setup lang="ts">
import type { RouterInput, RouterOutput } from '@codeanker/api'

import { apiClient } from '@/api'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { formatTimestamp } from '@codeanker/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'
import DataGridDoubleLineCell from '../DataGridDoubleLineCell.vue'
import DataTable, { type Query } from '../Table/DataTable.vue'
import initialData from '../Table/initialData'
import Badge from '../UIComponents/Badge.vue'
// import Button from '../UIComponents/Button.vue'

type AnmeldeLink = RouterOutput['anmeldungLink']['list']['data'][number]

type Props = {
  filter: RouterInput['anmeldungLink']['list']['section']
}

const props = defineProps<Props>()

const { setTitle } = useRouteTitle()
setTitle('Anmeldelinks')

const column = createColumnHelper<AnmeldeLink>()
const columns = [
  column.accessor('comment', {
    header: 'Bemerkung',
  }),
  column.accessor('usedAt', {
    id: 'status',
    header: 'Status',
    enableColumnFilter: true,
    cell({ getValue }) {
      const status = getValue<Date | undefined>()
      return h(Badge, {
        color: status ? 'primary' : 'warning',
        text: status ? 'Verwendet' : 'Offen',
      })
    },
    meta: {
      filter: {
        type: 'select',
        options: [
          { label: 'Offen', value: 'unused' },
          { label: 'Verwendet', value: 'used' },
        ],
      },
    },
  }),
  column.display({
    header: 'Anmeldung',
    cell({ row }) {
      return h(DataGridDoubleLineCell, {
        title: row.original?.anmeldung
          ? `${row.original.anmeldung.person.firstname} ${row.original.anmeldung.person.lastname}`
          : 'keine',
        message: row.original?.anmeldung?.createdAt ? formatTimestamp(row.original.anmeldung.createdAt) : '',
      })
    },
  }),
  column.accessor('unterveranstaltung.gliederung.name', {
    header: 'Gliederung',
  }),
  column.display({
    header: 'Erstellt von',
    cell({ row }) {
      return h(DataGridDoubleLineCell, {
        title: `${row.original.createdBy.person.firstname} ${row.original.createdBy.person.lastname}`,
        message: formatTimestamp(row.original.createdAt),
      })
    },
  }),
  // column.display({
  //   header: ' ',
  //   cell({ row }) {
  //     const link = `?token=${row.original.token}`
  //     return h(Button, {}, ['Link kopieren'])
  //   },
  // }),
]

const query: Query<AnmeldeLink> = (pagination, filter) =>
  useQuery({
    queryKey: ['anmeldeLink', pagination, filter],
    queryFn: () =>
      apiClient.anmeldungLink.list.query({
        section: props.filter,
        table: {
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
        },
      }),
    initialData,
    placeholderData: keepPreviousData,
  })
</script>

<template>
  <DataTable
    :query="query"
    :columns="columns"
  />
</template>
