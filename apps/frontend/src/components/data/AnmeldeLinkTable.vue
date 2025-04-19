<script setup lang="ts">
import { apiClient } from '@/api'
import type { RouterOutput } from '@codeanker/api'
import type { TGridColumn } from '@codeanker/datagrid'
import GenericDataGrid, {
  type FetchCountFunction,
  type FetchPageFunction,
  type GenericGridProps,
} from '../GenericDataGrid.vue'
import Badge from '../UIComponents/Badge.vue'

export type TData = RouterOutput['anmeldungLink']['list'][number]
export type GridProps = GenericGridProps<TData, unknown, unknown>

export type FetchPersonCountFunction = FetchCountFunction<unknown>
export type FetchPersonPageFunction = FetchPageFunction<TData, unknown, unknown>

const props = defineProps<{
  unterveranstaltungId: number
}>()

const columns: TGridColumn<TData, unknown>[] = [
  {
    field: 'id',
    title: '#',
    size: 'min-content',
  },
  {
    field: 'createdBy.person',
    title: 'Erstellt von',
    format: (row) => `${row.firstname} ${row.lastname}`,
  },
  {
    field: 'comment',
    title: 'Bemerkung',
  },
  {
    field: 'usedAt',
    title: 'Status',
    cell: Badge,
    cellProps: (ref) => {
      return {
        color: ref.value ? 'primary' : 'muted',
        text: ref.value ? 'Anmeldung erhalten' : 'Offen',
      }
    },
  },
  {
    field: 'anmeldung.person',
    title: 'Angemeldete Person',
    format: (row) => row && `${row.firstname} ${row.lastname}`,
  },
  {
    field: 'createdAt',
    title: 'Erstellt am',
    preset: 'datetime',
  },
  {
    field: 'usedAt',
    title: 'Benutzt am',
    preset: 'datetime',
  },
]

const fetchPage: FetchPersonPageFunction = () =>
  apiClient.anmeldungLink.list.query({
    unterveranstaltungId: props.unterveranstaltungId,
  })

const fetchCount: FetchPersonCountFunction = () =>
  apiClient.anmeldungLink.count.query({
    unterveranstaltungId: props.unterveranstaltungId,
  })
</script>

<template>
  <GenericDataGrid
    :columns="columns"
    :fetch-page="fetchPage"
    :fetch-count="fetchCount"
    :default-filter="{}"
    :default-order-by="[]"
    no-data-message="Es gibt keine Anmeldelinks."
  />
</template>
