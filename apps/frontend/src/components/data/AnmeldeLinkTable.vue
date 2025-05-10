<script setup lang="ts">
import { apiClient } from '@/api'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatTimestamp } from '@codeanker/helpers'

import DataGridVirtualList from '@/components/DataGrid/DataGridVirtualList.vue'
import { useDataGridFilter, useDataGridOrderBy, useGrid, type TGridColumn } from '@codeanker/datagrid'
import Badge from '../UIComponents/Badge.vue'
import DataGridDoubleLineCell from '../DataGridDoubleLineCell.vue'

type TAnmeldeLinkData = Awaited<RouterOutput['anmeldungLink']['list']>[number]
type TAnmeldeLinkFilter = RouterInput['anmeldungLink']['list']['filter']
type TAnmeldeLinkOrderBy = RouterInput['anmeldungLink']['list']['orderBy']

type Props = {
  filter: RouterInput['anmeldungLink']['list']['filter']
}

const props = defineProps<Props>()

const route = useRoute()
const router = useRouter()

const columns: TGridColumn<TAnmeldeLinkData, TAnmeldeLinkFilter>[] = [
  {
    field: 'id',
    title: '#',
    size: 'min-content',
  },
  {
    field: 'accessToken',
    title: 'Token',
    size: '330px',
    cell: DataGridDoubleLineCell,
    cellProps: (formattedValue, row) => {
      return {
        title: row.content?.accessToken ? `${row.content.accessToken}` : '',
        message: row.content?.comment ? row.content.comment : '',
      }
    },
  },
  {
    field: 'usedAt',
    title: 'Status',
    size: '100px',
    cell: Badge,
    cellProps: (ref) => {
      return {
        color: ref.value ? 'primary' : 'warning',
        text: ref.value ? 'Verwendet' : 'Offen',
      }
    },
  },
  {
    field: 'anmeldung.person',
    title: 'Anmeldung',
    cell: DataGridDoubleLineCell,
    cellProps: (formattedValue, row) => {
      return {
        title: row.content?.anmeldung
          ? `${row.content.anmeldung.person.firstname} ${row.content.anmeldung.person.lastname}`
          : 'keine',
        message: row.content?.anmeldung?.createdAt ? formatTimestamp(row.content.anmeldung.createdAt) : '',
      }
    },
  },
  {
    field: 'createdBy.person',
    title: 'Erstellt von',
    cell: DataGridDoubleLineCell,
    cellProps: (formattedValue, row) => {
      return {
        title: `${row.content.createdBy.person.firstname} ${row.content.createdBy.person.lastname}`,
        message: formatTimestamp(row.content.createdAt),
      }
    },
  },
]

if (props.filter?.type === 'veranstaltung') {
  columns.splice(columns.length - 1, 0, {
    field: 'unterveranstaltung.gliederung.name',
    title: 'Unterveranstaltung',
  })
}

const defaultOrderBy = {
  createdAt: 'desc',
} as const

const { filter, setFilter } = useDataGridFilter(props.filter, router, route)
const { orderBy, setOrderBy } = useDataGridOrderBy(columns, defaultOrderBy, router, route)

type Query = {
  filter: TAnmeldeLinkFilter
  orderBy: TAnmeldeLinkOrderBy
}

const query = computed<Query>(() => {
  return {
    filter: filter.value,
    orderBy: orderBy.value as NonNullable<TAnmeldeLinkOrderBy>,
  }
})

function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TAnmeldeLinkFilter,
  orderBy: TAnmeldeLinkOrderBy
) {
  return apiClient.anmeldungLink.list.query({ filter, orderBy, pagination })
}

async function fetchCount(filter: TAnmeldeLinkFilter) {
  const total = await apiClient.anmeldungLink.count.query({
    filter: filter,
  })

  return total
}

const { grid, fetchVisiblePages, pageChange, page } = useGrid<Query, TAnmeldeLinkData>({
  query,
  fetchPage: fetchPage,
  fetchCount: fetchCount,
  idField: 'id',
  route,
  router,
})
onMounted(() => {
  fetchVisiblePages()
})
</script>

<template>
  <div class="grid-rows[1fr, 50px] grid flex-grow">
    <DataGridVirtualList
      :grid="grid"
      :columns="columns"
      :page="page"
      :filter="filter"
      :order-by="orderBy"
      no-data-message="Es gibt bisher keine Anmeldungen."
      show-clickable
      @update:page="pageChange"
      @set-order-by="setOrderBy"
      @set-filter="setFilter"
    />
  </div>
</template>
