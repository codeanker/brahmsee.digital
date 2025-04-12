<script setup lang="ts" generic="TData extends RowData">
import type { Column, RowData, Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import BasicSelect from '../BasicInputs/BasicSelect.vue'

const props = defineProps<{
  column: Column<TData>
  table: Table<TData>
}>()

const type = computed(() => props.column.columnDef.meta?.filter?.type ?? 'text')
const options = computed(() => {
  const undef = {
    label: 'Bitte wählen …',
    value: '',
  }
  if (props.column.columnDef.meta?.filter?.type !== 'select') {
    return [undef]
  }

  return [undef, ...props.column.columnDef.meta.filter.options]
})

const columnFilterValue = computed(() => props.column.getFilterValue())
</script>

<template>
  <!-- <FunnelIcon class="size-4" /> -->

  <BasicSelect
    v-if="type === 'select'"
    :options="options"
    :model-value="columnFilterValue ?? ''"
    @update:model-value="column.setFilterValue"
  />
</template>
