<script
  setup
  lang="ts"
  generic="
    TData extends Record<string, any>,
    TFilter extends Record<string, any>,
    TOrderBy extends [string, 'asc' | 'desc' | undefined][]
  "
>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import DataGridVirtualList from '@/components/DataGrid/DataGridVirtualList.vue'
import { useDataGridOrderBy } from '@/composables/useDataGridOrderBy'
import { type TGridColumn, useDataGridFilter, useGrid } from '@codeanker/datagrid'

export type Pagination = {
  take: number
  skip: number
}

export type FetchPageFunction<TData, TFilter, TOrderBy> = (
  pagination: Pagination,
  filter: TFilter,
  orderBy: TOrderBy
) => Promise<TData[]>
export type FetchCountFunction<TFilter> = (filter: TFilter) => Promise<number>

export type GenericGridProps<TData, TFilter, TOrderBy> = {
  columns: TGridColumn<TData, TFilter>[]
  fetchPage: FetchPageFunction<TData, TFilter, TOrderBy>
  fetchCount: FetchCountFunction<TFilter>
  defaultFilter: TFilter
  defaultOrderBy: TOrderBy
  noDataMessage?: string
  showClickable?: boolean
}

const props = defineProps<GenericGridProps<TData, TFilter, TOrderBy>>()

const emit = defineEmits<{
  'row-click': [TData]
}>()

const route = useRoute()
const router = useRouter()

/// Filter via Route laden
const { filter, setFilter } = useDataGridFilter(props.defaultFilter, router, route)
const { orderBy, setOrderBy } = useDataGridOrderBy(props.columns, props.defaultOrderBy, router, route)

/// Bauen der Query
type Query = {
  filter: TFilter
  orderBy: TOrderBy
}
const query = computed(() => {
  return {
    filter: filter.value,
    orderBy: orderBy.value as TOrderBy,
  }
})

const { grid, fetchVisiblePages, pageChange, page } = useGrid<Query, TData>({
  query,
  fetchPage: props.fetchPage,
  fetchCount: props.fetchCount,
  idField: 'id',
  route,
  router,
})
onMounted(() => {
  fetchVisiblePages()
})
</script>

<template>
  <DataGridVirtualList
    :grid="grid"
    :columns="columns"
    :page="page"
    :filter="filter"
    :order-by="orderBy"
    :no-data-message="noDataMessage"
    :show-clickable="showClickable"
    @row-click="emit('row-click', $event.content)"
    @update:page="pageChange"
    @set-order-by="setOrderBy"
    @set-filter="setFilter"
  />
</template>
