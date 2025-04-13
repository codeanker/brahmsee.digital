<script setup lang="ts" generic="TData extends Record<string, any>">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

import DataGridHeader from './DataGridHeader.vue'
import DataGridRow from './DataGridRow.vue'
import DataGridRowPending from './DataGridRowPending.vue'
import DataGridRowSubheader from './DataGridRowSubheader.vue'

import {
  type TDataGridVirtualListProps,
  type TDataGridVirtualListEmits,
  useDataGridVirtualList,
} from '@codeanker/datagrid'

const props = defineProps<
  TDataGridVirtualListProps<TData> & {
    noDataMessage?: string
    /** Bei hover, bg änderen und cursor-pointer setzen. Hat nur style änderungen */
    showClickable?: boolean
  }
>()
const emit = defineEmits<TDataGridVirtualListEmits<TData>>()

const rowHeight = 50

const {
  containerProps,
  gridHeaderStyle,
  gridFooterStyle,
  wrapperProps,
  gridTemplateStyle,
  list,
  handleHeaderResizeDrag,
  columnsWithGroups,
  aggegationList,
} = useDataGridVirtualList(props, emit, {
  rowHeight,
})
</script>

<template>
  <div
    v-bind="containerProps"
    class="relative h-full w-full"
    data-testid="DataGridVirtualList"
  >
    <div
      :style="gridHeaderStyle"
      class="backdrop-blur-sm bg-white dark:bg-dark-primary"
    >
      <DataGridHeader
        :columns="columnsWithGroups"
        :order-by="orderBy"
        :filter="props.filter"
        @resize-drag="handleHeaderResizeDrag"
        @set-order-by="emit('setOrderBy', $event)"
        @set-filter="emit('setFilter', $event)"
      />
    </div>

    <div
      v-bind="wrapperProps"
      :style="gridTemplateStyle"
    >
      <template v-for="row in list">
        <DataGridRowPending
          v-if="row.data.type === 'pending'"
          :key="row.index + 'pending'"
          :height="rowHeight"
          :row="row.data"
          :columns="columnsWithGroups"
        />
        <DataGridRowSubheader
          v-else-if="row.data.type === 'subheader'"
          :key="row.index + 'subheader'"
          :height="rowHeight"
          :row="row.data"
          :columns="columns"
          @group-click="emit('group-click', $event)"
        />
        <DataGridRow
          v-else-if="row.data.type === 'row'"
          :key="row.index + 'row'"
          :height="rowHeight"
          :row="row.data"
          :columns="columnsWithGroups"
          :class="{ 'cursor-pointer': showClickable }"
          @row-click="emit('rowClick', $event)"
          @row-dbl-click="emit('rowDblClick', $event)"
        />
      </template>
    </div>
    <div
      :style="gridFooterStyle"
      class="bg-background border-t"
    >
      <DataGridRow
        v-for="row in aggegationList"
        :key="row.pageId + 'row-aggregation'"
        :height="rowHeight"
        :row="row"
        :columns="columnsWithGroups"
        @row-click="emit('rowClick', $event)"
        @row-dbl-click="emit('rowDblClick', $event)"
      />
    </div>
    <div
      v-if="list.length === 0"
      class="h-50vh my-16"
    >
      <div class="rounded-md bg-blue-50 dark:bg-blue-950 text-blue-500 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon
              class="h-5 w-5"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 flex-1 md:flex md:justify-between">
            <p class="mb-0">
              {{ noDataMessage ?? 'Keine Daten vorhanden.' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
