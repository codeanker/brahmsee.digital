<script setup lang="ts" generic="TData extends RowData">
import type { Column, RowData } from '@tanstack/vue-table'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import BasicDatepicker from '../BasicInputs/BasicDatepicker.vue'
import BasicSelect, { type Option } from '../BasicInputs/BasicSelect.vue'

const { column } = defineProps<{
  column: Column<TData>
}>()

const type = computed(() => column.columnDef.meta?.filter?.type ?? 'text')

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

const label = computed<string>(() => column.columnDef.header ?? column.columnDef.id)
const columnFilterValue = computed(() => column.getFilterValue())
</script>

<template>
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
</template>
