<script setup lang="ts" generic="TGridData, TQuery">
import type { VNode } from 'vue'

import {
  type TGridColumn,
  type TGridItem,
  type GridVirtualListOptions,
  type TGridQuery,
  GridVirtualList,
} from '@codeanker/core-grid'

interface TGridVirtualListProps {
  columns: TGridColumn<TGridData>[]
  groupBy?: string[]
  grid: TGridItem<TGridData>[]
}

defineProps<TGridVirtualListProps>()
// eslint-disable-next-line vue/define-emits-declaration
const emit = defineEmits(['index-change', 'row-click'])
// eslint-disable-next-line no-undef
const orderBy = defineModel<TGridQuery['orderBy']>('orderBy')
// eslint-disable-next-line no-undef
const filter = defineModel<TGridQuery['filter']>('filter')

const gridOptions: GridVirtualListOptions = {
  components: {
    GridColumn: {
      class:
        'py-5 pl-4 pr-3 text-sm group-[.uneven]:bg-gray-50 dark:group-[.uneven]:bg-gray-900 group-hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-t-gray-200',
    },
    GridPending: {
      class:
        'light:border-l-light-100 truncate border-b-[1px] border-l-[1px] border-b-gray-100 px-4 align-middle leading-[40px] flex items-center',
    },
    GridHeaderCell: {
      class: 'py-3.5 pl-4 pr-3 text-left text-sm font-semibold bg-white dark:bg-black',
    },
    GridSubheader: {
      class: 'border-b-[1px] border-b-gray-100 px-4 leading-[40px]',
    },
    GridAggregation: {
      class:
        'border-r-grey-100 truncate border-b-[3px] border-r-[1px] border-t-[2px] border-b-gray-100 border-t-gray-100 px-4 align-middle leading-[36px]',
    },
    GridHeaderPopover: {
      class: 'm-1 rounded-md border border-gray-100 bg-gray-200 w-64 shadow-sm left-0 cursor-default',
    },
  },
}
defineSlots<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [colKey: string]: (_props: { fieldValue: any; row: any }) => VNode
}>()
</script>

<template>
  <GridVirtualList
    v-model:order-by="orderBy"
    v-model:filter="filter"
    :grid="grid"
    :columns="columns"
    :options="gridOptions"
    :row-height="80"
    :group-by="groupBy"
    @index-change="emit('index-change', $event)"
    @row-click="emit('row-click', $event)"
  >
    <template
      v-for="(_, name) in $slots as {}"
      #[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </GridVirtualList>
</template>
