<template>
  <GenericDataGrid
    :columns="columns"
    :fetch-page="fetchPage"
    :fetch-count="fetchCount"
    :default-filter="{
      name: '',
      gliederungName: '',
    }"
    :default-order-by="[]"
    no-data-message="Es gibt bisher keine Personen."
    show-clickable
    @row-click="(person) => router.push({ name: 'Verwaltung Persondetails', params: { personId: person.id } })"
  />
</template>

<script setup lang="ts">
import { getAccountStatusColor } from '@/helpers/getAccountStatusColors'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import type { TGridColumn } from '@codeanker/datagrid'
import { dayjs } from '@codeanker/helpers'
import { useRouter } from 'vue-router'
import DataGridDoubleLineCell from '../DataGridDoubleLineCell.vue'
import GenericDataGrid, {
  type FetchCountFunction,
  type FetchPageFunction,
  type GenericGridProps,
} from '../GenericDataGrid.vue'
import Badge from '../UIComponents/Badge.vue'
import { apiClient } from '@/api'

export type TData = RouterOutput['person']['list'][number]
export type TFilter = RouterInput['person']['list']['filter']
export type TOrderBy = RouterInput['person']['list']['orderBy']
export type GridProps = GenericGridProps<TData, TFilter, TOrderBy>

export type FetchPersonCountFunction = FetchCountFunction<TFilter>
export type FetchPersonPageFunction = FetchPageFunction<TData, TFilter, TOrderBy>

const router = useRouter()

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'firstname',
    title: 'Name',
    sortable: true,
    format: (_, row) => `${row.firstname} ${row.lastname}`,
  },
  {
    field: 'birthday',
    title: 'Alter',
    preset: 'date',
    cell: DataGridDoubleLineCell,
    cellProps: (formattedValue, row) => {
      return {
        title: `${dayjs().diff(row.birthday, 'year')} Jahre`,
        message: formattedValue.value,
      }
    },
    sortable: true,
  },
  {
    field: 'gliederung.name',
    title: 'Gliederung',
    sortable: true,
  },
  {
    field: 'person.account.activatedAt',
    title: 'Account',
    cell: Badge,
    preset: 'date',
    cellProps: (formattedValue, row) => {
      return {
        color: getAccountStatusColor(row.content.account?.status),
        title: formattedValue.value,
        text: row.content.account?.status,
      }
    },
  },
]

const fetchPage: FetchPersonPageFunction = (pagination, filter, orderBy) =>
  apiClient.person.list.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })

const fetchCount: FetchPersonCountFunction = (filter) =>
  apiClient.person.count.query({
    filter: filter,
  })
</script>
