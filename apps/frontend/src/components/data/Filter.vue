<script setup lang="ts" generic="TData extends RowData, TValue = unknown">
import type { Column, RowData, Table } from '@tanstack/vue-table'
import { computed } from 'vue'
import BasicInput from '../BasicInputs/BasicInput.vue'
import BasicInputNumber from '../BasicInputs/BasicInputNumber.vue'

const props = defineProps<{
  column: Column<TData, TValue>
  table: Table<TData>
}>()

const firstValue = computed(() => props.table.getPreFilteredRowModel().flatRows[0]?.getValue(props.column.id))
const columnFilterValue = computed(() => props.column.getFilterValue())
const sortedUniqueValues = computed(() =>
  typeof firstValue.value === 'number' ? [] : Array.from(props.column.getFacetedUniqueValues().keys()).sort()
)
</script>

<template>
  <div v-if="typeof firstValue === 'number'">
    <div class="flex space-x-2">
      <BasicInputNumber
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[0] ?? ''"
        :placeholder="`Min ${column.getFacetedMinMaxValues()?.[0] ? `(${column.getFacetedMinMaxValues()?.[0]})` : ''}`"
        class="w-24 border shadow rounded"
        @update:model-value="(value) => column.setFilterValue((old: [number, number]) => [value, old?.[1]])"
      />
      <BasicInputNumber
        type="number"
        :min="Number(column.getFacetedMinMaxValues()?.[0] ?? '')"
        :max="Number(column.getFacetedMinMaxValues()?.[1] ?? '')"
        :model-value="(columnFilterValue as [number, number])?.[1] ?? ''"
        :placeholder="`Max ${column.getFacetedMinMaxValues()?.[1] ? `(${column.getFacetedMinMaxValues()?.[1]})` : ''}`"
        class="w-24 border shadow rounded"
        @update:model-value="(value) => column.setFilterValue((old: [number, number]) => [old?.[0], value])"
      />
    </div>
    <div class="h-1" />
  </div>
  <div v-else>
    <datalist :id="column.id + 'list'">
      <option
        v-for="value in sortedUniqueValues.slice(0, 5000)"
        :key="value"
        :value="value"
      />
    </datalist>
    <BasicInput
      type="text"
      :model-value="(columnFilterValue ?? '') as string"
      placeholder="Suche …"
      class="w-36 border shadow rounded"
      :list="column.id + 'list'"
      @update:model-value="(value) => column.setFilterValue(value)"
    />
    <div class="h-1" />
  </div>
</template>
