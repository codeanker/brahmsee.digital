<script setup lang="ts">
import { apiClient } from '@/api'
import {
  type CustomFieldPosition,
  CustomFieldPositionMapping,
  type CustomFieldType,
  CustomFieldTypeMapping,
  getEnumOptions,
  type RouterInput,
  type RouterOutput,
} from '@codeanker/api'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'
import DataGridDoubleLineCell from '../DataGridDoubleLineCell.vue'
import type { Query } from '../Table/DataTable.vue'
import DataTable from '../Table/DataTable.vue'
import initialData from '../Table/initialData'
import { loggedInAccount } from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'

type Filter = RouterInput['customFields']['list']
type CustomField = RouterOutput['customFields']['table']['data'][number]

const props = defineProps<{
  entity: Filter['entity']
  id: string
}>()

const router = useRouter()

const column = createColumnHelper<CustomField>()
const columns = [
  column.accessor('name', {
    header: 'Name',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  column.accessor('type', {
    header: 'Typ',
    enableColumnFilter: true,
    cell({ getValue }) {
      const type = getValue<CustomFieldType>()
      const { human, description } = CustomFieldTypeMapping[type]
      return h(DataGridDoubleLineCell, {
        title: human,
        message: description ?? '',
      })
    },
    meta: {
      filter: {
        type: 'select',
        options: getEnumOptions(CustomFieldTypeMapping),
      },
    },
  }),
  column.display({
    id: 'source',
    header: 'Quelle',
    cell({ row }) {
      if (row.original.veranstaltungId) {
        return 'Veranstaltung'
      } else if (row.original.unterveranstaltungId) {
        return 'Ausschreibung'
      }
      return '-'
    },
  }),
  column.accessor('required', {
    header: 'Erforderlich?',
    enableColumnFilter: true,
    cell({ getValue }) {
      const required = getValue<boolean>()
      if (required) {
        return h(CheckIcon, {
          class: 'text-primary-600 size-5',
        })
      } else {
        return h(XMarkIcon, {
          class: 'text-red-600 size-5',
        })
      }
    },
    meta: {
      filter: {
        type: 'select',
        options: [
          { label: 'Ja', value: 'true' },
          { label: 'Nein', value: 'false' },
        ],
      },
    },
  }),
  column.accessor('positions', {
    id: 'position',
    header: 'Positionen',
    enableColumnFilter: true,
    cell({ getValue }) {
      const positions = getValue<CustomFieldPosition[]>()
      return getEnumOptions(CustomFieldPositionMapping)
        .filter((o) => positions.includes(o.value))
        .map((o) => o.label)
        .join(', ')
    },
    meta: {
      filter: {
        type: 'select',
        options: getEnumOptions(CustomFieldPositionMapping),
      },
    },
  }),
]

const query: Query<CustomField> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['custom-fields', pagination, filter, orderBy],
    queryFn: () =>
      apiClient.customFields.table.query({
        entity: props.entity,
        entityId: props.id,
        table: {
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
          orderBy: orderBy.value,
        },
      }),
    initialData,
    placeholderData: keepPreviousData,
  })

function canEdit(field: CustomField) {
  if (field.veranstaltungId !== null && loggedInAccount.value?.role === 'ADMIN') {
    return true
  }

  if (field.unterveranstaltungId !== null && loggedInAccount.value?.role !== 'USER') {
    return true
  }

  return false
}

function onClick(field: CustomField) {
  if (!canEdit(field)) {
    return
  }

  if (props.entity === 'veranstaltung') {
    return router.push({
      name: 'Verwaltung Custom Field bearbeiten',
      params: { veranstaltungId: props.id, fieldId: field.id },
    })
  }

  if (props.entity === 'unterveranstaltung') {
    router.push({
      name: 'Unterveranstaltung Custom Field bearbeiten',
      params: { unterveranstaltungId: props.id, fieldId: field.id },
    })
  }
}
</script>

<template>
  <DataTable
    :query="query"
    :columns="columns"
    @dblclick="onClick"
  />
</template>
