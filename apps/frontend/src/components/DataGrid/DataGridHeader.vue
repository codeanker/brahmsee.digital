<script setup lang="ts">
import DataGridHeaderCell from './DataGridHeaderCell.vue'

import { type TDataGridHeaderProps, cn } from '@codeanker/datagrid'

const props = defineProps<
  Omit<TDataGridHeaderProps, 'orderBy'> & {
    orderBy: [string, 'asc' | 'desc'][]
  }
>()
const emit = defineEmits<{
  resizeDrag: [{ column: TDataGridHeaderProps['columns'][0]; width: number }]
  setOrderBy: [{ field: string; value: 'asc' | 'desc' | undefined }]
  setFilter: [{ key: any; value: any }]
}>()

function getOrderBy(columnField: string) {
  const obj = props.orderBy?.find(([key]) => key === columnField)
  const order = obj ? obj[1] : undefined
  return order
}
</script>

<template>
  <thead class="contents">
    <DataGridHeaderCell
      v-for="column in columns"
      :key="column.id"
      :column="column"
      :title="column.title || column.field"
      :class="cn('', props.class)"
      :order-by="getOrderBy(column.field)"
      :filter="filter?.[column.filter?.key]"
      @resize-drag="(width) => emit('resizeDrag', { column, width })"
      @set-order-by="(value) => emit('setOrderBy', value)"
      @set-filter="(value) => emit('setFilter', value)"
    />
  </thead>
</template>
