<script setup lang="ts">
import { apiClient } from '@/api'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { dayjs } from '@codeanker/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnFiltersState,
} from '@tanstack/vue-table'
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { type GenericGridProps } from '../GenericDataGrid.vue'
import Button from '../UIComponents/Button.vue'
import Filter from './Filter.vue'

export type TData = RouterOutput['person']['list']['data'][number]
export type TFilter = RouterInput['person']['list']['filter']
export type TOrderBy = RouterInput['person']['list']['orderBy']
export type GridProps = GenericGridProps<TData, TFilter, TOrderBy>

const router = useRouter()

const columnFilters = ref<ColumnFiltersState>([])

const pagination = ref({
  page: 1,
  perPage: 25,
})

const { data: persons } = useQuery({
  queryKey: ['person', 'list', columnFilters, pagination],
  queryFn: () => {
    return apiClient.person.list.query({
      filter: columnFilters.value.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.id]: curr.value,
        }),
        {}
      ),
      orderBy: [],
      pagination: pagination.value,
    })
  },
  // initialPageParam: 0,
  // getNextPageParam: (_lastGroup, groups) => groups.length,
  // refetchOnWindowFocus: false,
  placeholderData: keepPreviousData,
})

const columnHelper = createColumnHelper<TData>()
const columns = [
  columnHelper.display({
    id: 'image',
    header: 'Bild',
    cell: (props) => {
      const row = props.row.original
      if (!row.photoId) {
        return null
      }

      return h('img', {
        class: 'size-16 rounded-full mx-auto',
        src: `/api/download/file/LOCAL/${row.photoId}`,
      })
    },
  }),
  columnHelper.accessor((row) => `${row.firstname} ${row.lastname}`, {
    id: 'name',
    header: 'Name',
    enableColumnFilter: true,
  }),
  columnHelper.accessor((row) => `${dayjs().diff(row.birthday, 'year')} Jahre`, {
    header: 'Alter',
    enableColumnFilter: false,
  }),
  columnHelper.accessor('gliederung.name', {
    header: 'Gliederung',
    enableColumnFilter: false,
    meta: {
      facet: 'select',
    },
  }),
  columnHelper.accessor('_count.anmeldungen', {
    header: 'Anzahl Anmeldungen',
    enableColumnFilter: false,
  }),
  // columnHelper.display({
  //   id: 'role',
  //   header: 'Rolle',
  //   cell: (props) => {
  //     const row = props.row.original
  //     return h(Badge, { color: getAccountStatusColor(row.account?.status), text: row.account?.status })
  //   },
  // }),
]

const data = computed(() => persons.value?.data ?? [])

const table = useVueTable<TData>({
  columns,
  data,
  getRowId: ({ id }) => `${id}`,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  manualFiltering: true,
  manualPagination: true,
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value = typeof updaterOrValue === 'function' ? updaterOrValue(columnFilters.value) : updaterOrValue
  },
})

function goToPage(page: number) {
  pagination.value.page += page
}
</script>

<template>
  <div class="flex flex-col md:flex-row justify-between items-end">
    <div class="flex flex-row gap-x-4 my-4">
      <Button
        :disabled="pagination.page <= 1"
        @click="goToPage(-1)"
      >
        Zurück
      </Button>
      <Button> {{ pagination.page }} / {{ persons?.pages }} </Button>
      <Button
        :disabled="(persons?.page ?? 0) == (persons?.pages ?? 0)"
        @click="goToPage(1)"
      >
        Weiter
      </Button>
    </div>
    <div
      id="filters"
      class="flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:gap-y-0 my-4"
    >
      <!-- <GliederungTypeahead
        v-model="columnFilters.gliederung"
        required
      /> -->
    </div>
  </div>

  <table>
    <thead>
      <tr
        v-for="headerGroup in table.getHeaderGroups()"
        :key="headerGroup.id"
      >
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          :colSpan="header.colSpan"
          class="bg-gray-200 py-4 dark:bg-gray-700"
        >
          <FlexRender
            v-if="!header.isPlaceholder"
            :render="header.column.columnDef.header"
            :props="header.getContext()"
          />
          <template v-if="!header.isPlaceholder && header.column.getCanFilter()">
            <Teleport
              defer
              to="#filters"
            >
              <div>
                <label class="font-medium">{{ header.column.columnDef.header }}</label>
                <Filter
                  :column="header.column"
                  :table="table"
                />
              </div>
            </Teleport>
          </template>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in table.getRowModel().rows"
        :key="row.id"
        class="even:bg-gray-100 dark:even:bg-gray-900 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
        @dblclick="router.push({ name: 'Verwaltung Persondetails', params: { personId: row.id } })"
      >
        <td
          v-for="cell in row.getVisibleCells()"
          :key="cell.id"
          class="py-3 text-center"
        >
          <FlexRender
            :render="cell.column.columnDef.cell"
            :props="cell.getContext()"
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
