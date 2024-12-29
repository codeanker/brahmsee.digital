<script setup lang="ts">
import { faker } from '@faker-js/faker'
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import DataGridVirtualList from '@/components/DataGrid/DataGridVirtualList.vue'
import { useDataGridOrderBy } from '@/composables/useDataGridOrderBy'
import { type TGridColumn, useDataGridFilter, useGrid } from '@codeanker/datagrid'

const route = useRoute()
const router = useRouter()

/// Typen von den Daten, Filter und Sortierung
// @todo types
type TUserGridData = {
  id: string
  name: string
  birthdate: string
}
type TUserGridFilter = {
  name: string
}
type TUserGridOrderBy = ['birthdate', 'asc' | 'desc' | undefined][]

/// Mockdaten
// zur veranschaulichung wird mockListm mit beispieldaten von fakerjs befüllt

function createRandomUser(): TUserGridData {
  return {
    id: faker.string.uuid(),
    name: faker.internet.userName(),
    birthdate: faker.date.birthdate().toString(),
  }
}
const mockList: TUserGridData[] = faker.helpers.multiple(createRandomUser, {
  count: 5000,
})

/// Definieren der columns
const columns: TGridColumn<TUserGridData, TUserGridFilter>[] = [
  {
    field: 'name',
    title: 'Name',
    size: '1fr',
    filter: { component: BasicInput, key: 'name' },
  },
  {
    field: 'birthdate',
    title: 'Geburtstag',
    preset: 'date',
    size: '1fr',
    sortable: true,
  },
]

/// Filter via Route laden
const defaultFilter: TUserGridFilter = {
  // Momentan müssen leere strings initialisiert werden!
  name: '',
}

const defaultOrderBy: TUserGridOrderBy = [['birthdate', 'asc']]

const { filter, setFilter } = useDataGridFilter(defaultFilter, router, route)
const { orderBy, setOrderBy } = useDataGridOrderBy(columns, defaultOrderBy, router, route)

/// Bauen der Query
type Query = {
  filter: TUserGridFilter
  orderBy: TUserGridOrderBy
}
const query = computed(() => {
  return {
    filter: filter.value,
    orderBy: orderBy.value as TUserGridOrderBy,
  }
})

/// useGrid und useFeathersGrid composable zum fetchen
async function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TUserGridFilter,
  orderBy: TUserGridOrderBy
) {
  // Als beispiel wird hier die mockList gefiltert, sortiert und paginiert
  // in einer echten anwendung würde hier die daten von der api geholt werden
  // und die filter, sortierung und pagination an die api übergeben werden.
  return mockList
    .filter((item, index) => {
      // Pagination
      return index >= pagination.skip && index < pagination.skip + pagination.take
    })
    .filter((item) => {
      // Filter anwenden
      return filter.name != '' ? item.name.includes(filter.name) : true
    })
    .sort((a, b) => {
      // Sortierung anwenden
      const orderByBirthdate = orderBy.find(([key]) => key === 'birthdate')?.[1]
      if (orderByBirthdate === 'asc') {
        return new Date(a.birthdate).getTime() - new Date(b.birthdate).getTime()
      } else if (orderByBirthdate === 'desc') {
        return a.birthdate < b.birthdate ? 1 : -1
      } else {
        return 0
      }
    })
}
async function fetchCount(filter: TUserGridFilter) {
  // Als beispiel wird hier die mockList gefiltert
  // in einer echten anwendung würde hier die daten von der api geholt werden
  return mockList.filter((item) => {
    return filter.name != '' ? item.name.includes(filter.name) : true
  }).length
}
const { grid, fetchVisiblePages, pageChange, page } = useGrid<Query, TUserGridData>({
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
  <DataGridVirtualList
    :grid="grid"
    :columns="columns"
    :page="page"
    :filter="filter"
    :order-by="orderBy"
    @update:page="pageChange"
    @set-order-by="setOrderBy"
    @set-filter="setFilter"
  />
</template>
