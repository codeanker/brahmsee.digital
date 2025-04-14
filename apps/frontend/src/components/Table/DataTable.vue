<script setup lang="ts" generic="TData extends RowData">
import { BackspaceIcon, FunnelIcon as FunnelIconOutline } from '@heroicons/vue/24/outline'
import {
  ArrowPathIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon as FunnelIconSolid,
} from '@heroicons/vue/24/solid'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import {
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type RowData,
} from '@tanstack/vue-table'
import { computed, ref, Teleport, useTemplateRef, type Ref } from 'vue'
import LoadingBar from '../LoadingBar.vue'
import Button from '../UIComponents/Button.vue'
import Filter from './Filter.vue'
import illustrationNoData from '@/assets/illustration/undraw_empty_4zx0.svg'

export type QueryResponse<T> = {
  data: T[]
  total: number
  pagination: {
    page: number
    pages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export type Query<T> = (
  pagination: Ref<PaginationState>,
  filter: Ref<ColumnFiltersState>
) => UseQueryDefinedReturnType<QueryResponse<T>, any>

const props = defineProps<{
  columns: ColumnDef<TData, any>[]
  query: Query<TData>
}>()

const emit = defineEmits<{
  click: [row: TData]
  dblclick: [row: TData]
}>()

function useUpdater<T>(ref: Ref<T>): OnChangeFn<T> {
  return (updater) => {
    if (typeof updater === 'function') {
      ref.value = updater(ref.value)
    } else {
      ref.value = updater
    }
  }
}

const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 10,
})
const columnFilters = ref<ColumnFiltersState>([])

const query = props.query(pagination, columnFilters)
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
  state: {
    get pagination() {
      return pagination.value
    },
    get columnFilters() {
      return columnFilters.value
    },
  },
})

const filterContainer = useTemplateRef('filterContainer')

// const paginationButtons = computed(() =>
//   generatePagination(query.data.value.pagination.pages, query.data.value.pagination.page + 1)
// )
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 items-end mb-4 gap-y-6">
    <div class="justify-self-start space-x-2">
      <Button
        color="secondary"
        @click="query.refetch()"
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
      <span> Seite {{ table.getState().pagination.pageIndex + 1 }} von {{ table.getPageCount() }} </span>
    </div>

    <div class="md:justify-self-end flex flex-col md:flex-row gap-4 md:items-end">
      <div
        ref="filterContainer"
        class="flex flex-col md:flex-row gap-x-4"
      ></div>
      <Button
        color="danger"
        class="mb-1"
        title="Alle Filter löschen"
        @click="table.setColumnFilters([])"
      >
        <BackspaceIcon class="size-5" />
      </Button>
    </div>
  </div>

  <LoadingBar :active="query.isFetching.value" />

  <table class="w-full">
    <thead class="bg-primary-700 text-white">
      <tr
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :colSpan="header.colSpan"
          class="text-left px-2 py-4 border-b-2"
        >
          <div class="flex flex-row justify-between items-center">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
            <template v-if="!header.isPlaceholder && header.column.getCanFilter()">
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
                <Filter :column="header.column" />
              </Teleport>
            </template>
          </div>
        </th>
      </tr>
    </thead>
    <tbody v-if="table.getRowCount() > 0">
      <tr
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="even:bg-slate-50 transition-colors hover:bg-slate-200"
        @click="emit('click', row.original)"
        @dblclick="emit('dblclick', row.original)"
      >
        <td
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          class="px-2 py-4"
        >
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
          />
        </td>
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
        <th
          v-for="header in footerGroup.headers"
          :key="header.id"
          :colSpan="header.colSpan"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.footer"
            :props="header.getContext()"
          />
        </th>
      </tr>
    </tfoot>
  </table>
</template>
