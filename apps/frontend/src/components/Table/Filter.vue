<script setup lang="ts" generic="TData extends RowData">
import type { Column, HeaderContext, RowData } from '@tanstack/vue-table'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import BasicDatepicker from '../BasicInputs/BasicDatepicker.vue'
import BasicSelect, { type Option } from '../BasicInputs/BasicSelect.vue'
import BasicInput from '../BasicInputs/BasicInput.vue'
import BasicInputNumber from '../BasicInputs/BasicInputNumber.vue'

const { column, context } = defineProps<{
  column: Column<TData>
  context: HeaderContext<TData, unknown>
}>()

const type = computed(() => column.columnDef.meta?.filter?.type ?? 'text')

console.log(column.columnDef.meta?.filter)

const options = useAsyncState<Option[]>(
  async () => {
    const undef: Option = {
      label: 'Alles',
      value: '',
    }
    if (column.columnDef.meta?.filter?.type !== 'select') {
      return [undef]
    }

    const opts = column.columnDef.meta.filter.options
    if (typeof opts === 'function') {
      const resolvedOpts = await opts()
      return [undef, ...resolvedOpts]
    }

    return [undef, ...opts]
  },
  [],
  {
    immediate: column.columnDef.meta?.filter?.type === 'select',
  }
)

const label = computed<string>(() => {
  if (!column.columnDef.header) {
    return column.columnDef.id ?? ''
  }

  if (typeof column.columnDef.header === 'string') {
    return column.columnDef.header
  }

  return column.columnDef.header(context)
})

// FIXME: Infer the type somehow
const columnFilterValue = computed<any>(() => column.getFilterValue())
</script>

<template>
  <BasicInput
    v-if="type === 'text'"
    :label="label"
    :model-value="columnFilterValue ?? ''"
    @update:model-value="column.setFilterValue"
  />

  <BasicInputNumber
    v-if="type === 'number'"
    :label="label"
    :model-value="columnFilterValue ?? ''"
    @update:model-value="column.setFilterValue"
  />

  <BasicDatepicker
    v-if="type === 'date'"
    :label="label"
    :model-value="columnFilterValue ?? ''"
    @update:model-value="column.setFilterValue"
  />

  <BasicDatepicker
    v-if="type === 'date-range'"
    :label="label"
    :model-value="columnFilterValue ?? ''"
    range
    @update:model-value="column.setFilterValue"
  />

  <BasicSelect
    v-if="type === 'select'"
    :label="label"
    :options="options.state.value"
    :model-value="columnFilterValue ?? ''"
    @update:model-value="column.setFilterValue"
  />

  <BasicSelect
    v-if="type === 'multi-select'"
    :label="label"
    :options="options.state.value"
    :model-value="columnFilterValue ?? ''"
    multiple
    @update:model-value="column.setFilterValue"
  />
</template>
