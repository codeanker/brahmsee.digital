<script setup lang="ts">
import { useRouter } from 'vue-router'

import { apiClient } from '@/api'
import { useRouteTitle } from '@/composables/useRouteTitle'
import type { StatusColors } from '@/helpers/getAccountStatusColors'
import { UnterveranstaltungTypeMapping, type RouterOutput, type UnterveranstaltungType } from '@codeanker/api'
import { dayjs, formatCurrency } from '@codeanker/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'
import type { Option } from '../BasicInputs/BasicSelect.vue'
import DataTable, { type Query } from '../Table/DataTable.vue'
import initialData from '../Table/initialData'
import Badge from '../UIComponents/Badge.vue'

const props = defineProps<{
  veranstaltungId?: string
}>()

type Unterveranstaltung = RouterOutput['unterveranstaltung']['list']['data'][number]

const { setTitle } = useRouteTitle()
setTitle('Unterveranstaltungen')

const router = useRouter()

const typeColors: Record<UnterveranstaltungType, StatusColors> = {
  GLIEDERUNG: 'secondary',
  CREW: 'muted',
}

const column = createColumnHelper<Unterveranstaltung>()
const columns = [
  column.accessor('veranstaltung.name', {
    id: 'veranstaltungId',
    header: 'Veranstaltung',
    meta: {
      hidden: props.veranstaltungId !== undefined,
      filter: {
        type: 'select',
        async options() {
          const l = await apiClient.veranstaltung.list.query()
          return l.map<Option>((i) => {
            return {
              value: i.id,
              label: i.name,
            }
          })
        },
      },
    },
  }),
  column.accessor('gliederung.name', {
    id: 'gliederungName',
    header: 'Gliederung',
    enableColumnFilter: true,
    meta: {
      filter: {
        type: 'text',
      },
    },
  }),
  column.accessor('type', {
    id: 'type',
    header: 'Typ',
    enableColumnFilter: true,
    cell({ getValue }) {
      const type = getValue<UnterveranstaltungType>()
      return h(Badge, {
        text: UnterveranstaltungTypeMapping[type].human,
        color: typeColors[type],
      })
    },
    meta: {
      filter: {
        type: 'select',
        options: Object.keys(UnterveranstaltungTypeMapping).map((r) => ({
          label: UnterveranstaltungTypeMapping[r].human,
          value: r,
        })),
      },
    },
  }),
  column.accessor('meldeschluss', {
    id: 'meldeschluss',
    header: 'Meldeschluss',
    enableColumnFilter: true,
    enableSorting: true,
    cell({ getValue }) {
      const date = getValue<Date>()
      return dayjs(date).format('dddd, DD. MMMM YYYY')
    },
    meta: {
      filter: {
        type: 'date-range',
      },
    },
  }),
  column.accessor('teilnahmegebuehr', {
    id: 'cost',
    header: 'Gebühr',
    enableSorting: true,
    cell({ getValue }) {
      const cost = getValue<number>()
      return formatCurrency(cost)
    },
  }),
  column.display({
    id: 'anmeldungen',
    header: 'Anm. / Max',
    cell({ row: { original } }) {
      return `${original._count.Anmeldung} / ${original.maxTeilnehmende}`
    },
  }),
]

const query: Query<Unterveranstaltung> = (pagination, filter) =>
  useQuery({
    queryKey: ['unterveranstaltung', pagination, filter],
    queryFn: () =>
      apiClient.unterveranstaltung.list.query({
        veranstaltungId: props.veranstaltungId,
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

function onClick(unterveranstaltung: Unterveranstaltung) {
  router.push({ name: 'UnterveranstaltungDetail', params: { unterveranstaltungId: unterveranstaltung.id } })
}
</script>

<template>
  <DataTable
    :query="query"
    :columns="columns"
    @dblclick="onClick"
  />
</template>
