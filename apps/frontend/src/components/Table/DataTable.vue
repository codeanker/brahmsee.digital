<script setup lang="ts" generic="TData extends RowData">
import illustrationNoData from '@/assets/illustration/undraw_empty_4zx0.svg'
import cn from '@/helpers/cn'
import type { QueryResponse } from '@codeanker/api'
import { BackspaceIcon, FunnelIcon as FunnelIconOutline } from '@heroicons/vue/24/outline'
import {
  ArrowPathIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  FunnelIcon as FunnelIconSolid,
} from '@heroicons/vue/24/solid'
import { type UseQueryDefinedReturnType } from '@tanstack/vue-query'
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  useVueTable,
  type Column,
  type ColumnDef,
  type ColumnFiltersState,
  type Header,
  type OnChangeFn,
  type PaginationState,
  type RowData,
  type SortDirection,
  type SortingState,
} from '@tanstack/vue-table'
import { computed, ref, unref, useTemplateRef, watch, type Ref } from 'vue'
import LoadingBar from '../LoadingBar.vue'
import Button from '../UIComponents/Button.vue'
import Filter from './Filter.vue'

export type Query<T> = (
  pagination: Ref<PaginationState>,
  filter: Ref<ColumnFiltersState>,
  orderBy: Ref<SortingState>
) => UseQueryDefinedReturnType<QueryResponse<T>, any>

const props = defineProps<{
  columns: ColumnDef<TData, any>[]
  query: Query<TData>
  initialPagination?: PaginationState
  initialSort?: SortingState
}>()

const emit = defineEmits<{
  click: [row: TData]
  dblclick: [row: TData]
  refresh: []
}>()

function useUpdater<T>(ref: Ref<T>): OnChangeFn<T> {
  return (updater) => {
    if (typeof updater === 'function') {
      // @ts-expect-error Type Inference seems broken
      ref.value = updater(ref.value)
    } else {
      ref.value = updater
    }
  }
}

const pagination = ref<PaginationState>(
  props.initialPagination ?? {
    pageIndex: 0,
    pageSize: 10,
  }
)
const columnFilters = ref<ColumnFiltersState>([])
const columnSorting = ref<SortingState>(props.initialSort ?? [])

const query = props.query(pagination, columnFilters, columnSorting)
const data = computed(() => query.data.value.data)

const table = useVueTable({
  data,
  get rowCount() {
    return query.data.value.total
  },
  get pageCount() {
    return query.data.value.pagination.pages
  },
  columns: props.columns,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  manualPagination: true,
  manualFiltering: true,
  manualSorting: true,
  onPaginationChange: useUpdater(pagination),
  onColumnFiltersChange: useUpdater(columnFilters),
  onSortingChange: useUpdater(columnSorting),
  sortDescFirst: false,
  state: {
    get pagination() {
      return pagination.value
    },
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return columnSorting.value
    },
  },
})

const hasFilters = computed(() => table._getColumnDefs().some((d) => d.enableColumnFilter === true))

// reset pagination when filter change
watch(columnFilters, () => {
  table.setPageIndex(0)
})

defineExpose({
  query,
  table,
})

const filterContainer = useTemplateRef('filterContainer')

// const paginationButtons = computed(() =>
//   generatePagination(query.data.value.pagination.pages, query.data.value.pagination.page + 1)
// )

function refresh() {
  emit('refresh')
  query.refetch()
}

function isFilterEnabled({ isPlaceholder, column }: Header<TData, unknown>): boolean {
  return !isPlaceholder && column.columnDef.enableColumnFilter === true
}

function isSortingEnabled({ column }: Header<TData, unknown>): boolean {
  return column.columnDef.enableSorting === true
}

function toggleSorting(column: Column<TData>): void {
  if (column.columnDef.enableSorting === true) {
    column.toggleSorting()
  }
}

function isShowSortIcon(column: Column<TData>, wanted?: SortDirection): boolean {
  const state = column.getIsSorted()

  if (wanted === undefined) {
    return state === false
  } else if (state !== false) {
    const isInverted = column.columnDef.invertSorting ?? false

    // asc === asc
    // desc === desc
    // asc === isInverted && desc
    // desc === isInverted && asc

    if (isInverted) {
      return state !== wanted
    } else {
      return state === wanted
    }
  }

  return false
}
</script>

<template>
  <div
    v-if="hasFilters"
    class="justify-self-start flex flex-col md:flex-row gap-4 md:items-end mb-4"
  >
    <div
      ref="filterContainer"
      class="flex flex-col md:flex-row gap-x-4"
    >
      <slot name="filter" />
    </div>
    <Button
      color="danger"
      class="mb-1"
      title="Alle Filter löschen"
      @click="table.setColumnFilters([])"
    >
      <BackspaceIcon class="size-5" />
    </Button>
  </div>

  <LoadingBar :active="query.isFetching.value" />

  <table class="w-full">
    <thead class="bg-primary-700 text-white">
      <tr
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <template
          v-for="header in headerGroup.headers"
          :key="header.id"
        >
          <th
            v-if="unref(header.column.columnDef.meta?.hidden) !== true"
            :colSpan="header.colSpan"
            :class="cn('text-left px-2 py-4 border-b-2', header.column.columnDef.meta?.class?.header)"
            :style="{ width: `${header.getSize()}px` }"
          >
            <div
              :class="cn('flex flex-row gap-x-2 items-center', { 'cursor-pointer': isSortingEnabled(header) })"
              @click="() => toggleSorting(header.column)"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <template v-if="isFilterEnabled(header)">
                <FunnelIconSolid
                  v-if="header.column.getIsFiltered()"
                  class="size-4"
                />
                <FunnelIconOutline
                  v-if="!header.column.getIsFiltered()"
                  class="size-4"
                />
                <Teleport
                  v-if="filterContainer"
                  :to="filterContainer"
                >
                  <Filter
                    :column="header.column"
                    :context="header.getContext()"
                  />
                </Teleport>
              </template>
              <template v-if="isSortingEnabled(header)">
                <ChevronUpDownIcon
                  v-if="isShowSortIcon(header.column)"
                  class="size-6"
                />
                <ChevronUpIcon
                  v-if="isShowSortIcon(header.column, 'asc')"
                  class="size-4"
                />
                <ChevronDownIcon
                  v-if="isShowSortIcon(header.column, 'desc')"
                  class="size-4"
                />
              </template>
            </div>
          </th>
        </template>
      </tr>
    </thead>
    <tbody v-if="table.getRowCount() > 0">
      <tr
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="even:bg-slate-50 transition-colors hover:bg-slate-200 cursor-pointer dark:even:bg-slate-800 dark:hover:bg-slate-700"
        @click="emit('click', row.original)"
        @dblclick="emit('dblclick', row.original)"
      >
        <template
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
        >
          <td
            v-if="unref(cell.column.columnDef.meta?.hidden) !== true"
            :class="cn('px-2 py-4', cell.column.columnDef.meta?.class?.body)"
            :style="{ width: `${cell.column.getSize()}px` }"
          >
            <FlexRender
              :render="cell.column.columnDef.cell"
              :props="cell.getContext()"
            />
          </td>
        </template>
      </tr>
    </tbody>
    <tbody v-else-if="!query.isFetching.value">
      <tr>
        <td
          :colspan="table.getFlatHeaders().length"
          class="py-12 space-y-12"
        >
          <p class="font-medium text-2xl text-center">Keine Ergebnisse …</p>
          <img
            :src="illustrationNoData"
            class="mx-auto size-1/4"
          />
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr
        v-for="footerGroup in table.getFooterGroups()"
        :key="footerGroup.id"
      >
        <template
          v-for="header in footerGroup.headers"
          :key="header.id"
        >
          <th
            v-if="unref(header.column.columnDef.meta?.hidden) !== true"
            :colSpan="header.colSpan"
            :class="cn(header.column.columnDef.meta?.class?.footer)"
            :style="{ width: `${header.getSize()}px` }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.footer"
              :props="header.getContext()"
            />
          </th>
        </template>
      </tr>
    </tfoot>
  </table>

  <!-- md:justify-self-end -->
  <div class="space-x-2 mt-4">
    <Button
      color="secondary"
      @click="refresh"
    >
      <ArrowPathIcon class="size-4" />
    </Button>

    <Button
      :disabled="!table.getCanPreviousPage() || !query.isSuccess"
      @click="table.firstPage()"
    >
      <ChevronDoubleLeftIcon class="size-4" />
    </Button>
    <Button
      :disabled="!table.getCanPreviousPage() || !query.isSuccess"
      @click="table.previousPage()"
    >
      <ChevronLeftIcon class="size-4" />
    </Button>

    <!-- <Button
        v-for="(button, index) in paginationButtons"
        :key="index"
        :disabled="typeof button === 'symbol'"
        :color="query.data.value.pagination.page + 1 === button ? 'primary' : 'info'"
      >
        <template v-if="typeof button === 'number'">
          {{ button }}
        </template>
        <template v-else>
          <EllipsisHorizontalIcon class="size-4" />
        </template>
      </Button> -->

    <Button
      :disabled="!table.getCanNextPage() || !query.isSuccess.value"
      @click="table.nextPage()"
    >
      <ChevronRightIcon class="size-4" />
    </Button>
    <Button
      :disabled="!table.getCanNextPage() || !query.isSuccess.value"
      @click="table.lastPage()"
    >
      <ChevronDoubleRightIcon class="size-4" />
    </Button>
    <div class="space-x-8 inline">
      <span> Seite {{ table.getState().pagination.pageIndex + 1 }} von {{ table.getPageCount() }} </span>
      <span class="text-sm"
        >Insgesamt <u>{{ query.data.value.total }}</u> Ergebnisse</span
      >
    </div>
  </div>
</template>
