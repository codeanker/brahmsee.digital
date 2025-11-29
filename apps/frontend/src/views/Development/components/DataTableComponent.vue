<script setup lang="ts">
import type { Query } from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { faker } from '@faker-js/faker'
import DataTable from '@/components/Table/DataTable.vue'
import { dayjs } from '@codeanker/helpers'

type Row = {
  name: string
  birthday: Date
}

const column = createColumnHelper<Row>()
const columns = [
  column.accessor('name', {
    header: 'Name',
  }),
  column.accessor('birthday', {
    header: 'Geburtstag',
    meta: {
      filter: {
        type: 'date',
      },
    },
    cell({ getValue }) {
      const birthday = getValue<Date>()
      return dayjs(birthday).format('dddd, DD. MMMM YYYY')
    },
  }),
]

function createRandomRow(): Row {
  return {
    name: faker.person.fullName(),
    birthday: faker.date.past(),
  }
}

faker.seed(1337)
const amount = 8
const data = [...Array(amount)].map(() => createRandomRow())

const query: Query<Row> = (pagination, filter) =>
  useQuery({
    queryKey: ['data-table-mock', pagination, filter],
    queryFn: async () => {
      const filters = filter.value.reduce((prev, curr) => {
        return {
          ...prev,
          [curr.id]: curr.value,
        }
      }, {}) as Record<string, any>
      return {
        data: data.filter((r) => {
          if (filters.name && !r.name.toLowerCase().includes(filters.name.toLowerCase())) {
            return false
          }
          if (filters.birthday && !dayjs(r.birthday).isSame(filters.birthday, 'day')) {
            console.log(r.birthday, filters.birthday, dayjs(r.birthday).isSame(filters.birthday, 'day'))
            return false
          }
          return true
        }),
        total: amount,
        pagination: {
          page: 1,
          pages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      }
    },
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
