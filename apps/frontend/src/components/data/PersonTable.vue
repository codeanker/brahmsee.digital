<script setup lang="ts">
import { apiClient } from '@/api'
import { useRouteTitle } from '@/composables/useRouteTitle'
import type { RouterOutput } from '@codeanker/api'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'
import { useRouter } from 'vue-router'
import type { Query } from '../Table/DataTable.vue'
import initialData from '../Table/initialData'
import UserLogo from '../UIComponents/UserLogo.vue'
import DataTable from '../Table/DataTable.vue'
import { dayjs } from '@codeanker/helpers'

type Person = RouterOutput['person']['list']['data'][number]

const { setTitle } = useRouteTitle()
setTitle('Personen')

const router = useRouter()

const column = createColumnHelper<Person>()
const columns = [
  column.accessor('photoId', {
    size: 10,
    header: 'Foto',
    enableColumnFilter: false,
    cell({ getValue, row }) {
      const id = getValue<string>()
      return h(UserLogo, {
        firstname: row.original.firstname,
        lastname: row.original.lastname,
        photoId: id,
        cssClasses: 'h-10 w-10',
      })
    },
  }),
  column.accessor('id', {
    id: 'name',
    header: 'Name',
    cell({ row }) {
      return `${row.original.firstname} ${row.original.lastname}`
    },
  }),
  column.accessor('birthday', {
    header: 'Alter',
    enableColumnFilter: false,
    cell({ getValue }) {
      const value = getValue<Date>()
      return dayjs().diff(value, 'year') + ' Jahre'
    },
  }),
  column.accessor('gliederung.name', {
    header: 'Gliederung',
    // meta: {
    //   filter: {
    //     type: 'select',
    //     options: async () => {
    //       const values = await apiClient.gliederung.publicList.query({
    //         filter: {},
    //         pagination: {
    //           take: 1000,
    //           skip: 0,
    //         },
    //         orderBy: [['name', 'asc']],
    //       })
    //       return values.map((v) => ({ value: v.id, label: v.name }))
    //     },
    //   },
    // },
  }),
  column.accessor('anmeldungen._count', {
    header: 'Anmeldungen',
    enableColumnFilter: false,
    cell({ getValue }) {
      return getValue<number>() ?? 0
    },
  }),
]

const query: Query<Person> = (pagination, filter) =>
  useQuery({
    queryKey: ['person', pagination, filter],
    queryFn: () =>
      apiClient.person.list.query({
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

function onClick(person: Person) {
  router.push({ name: 'Verwaltung Persondetails', params: { personId: person.id } })
}
</script>

<template>
  <DataTable
    :query="query"
    :columns="columns"
    @dblclick="onClick"
  />
</template>
