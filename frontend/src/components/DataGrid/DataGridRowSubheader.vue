<script setup lang="ts">
import DataGridRowCell from './DataGridRowCell.vue'

import { type TDataGridRowProps, cn } from '@codeanker/datagrid'

const props = defineProps<TDataGridRowProps>()

const emit = defineEmits<{
  'group-click': [string] // @todo type from TDataGridRowProps['row']['groupId']
}>()
</script>

<template>
  <tr class="contents">
    <td
      :class="cn('subheader border-b flex cursor-pointer select-none items-center gap-1', props.class)"
      :style="{ 'padding-left': `${props.row.depth * 20}px!important` }"
      @click="emit('group-click', props.row.groupId)"
    >
      <svg
        v-if="props.row.collapsed"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 4.5l7.5 7.5-7.5 7.5"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m19.5 8.25-7.5 7.5-7.5-7.5"
        />
      </svg>
      {{ props.row.value }}
    </td>
    <DataGridRowCell
      v-for="column in columns"
      :key="`${column.field}-${row.id}`"
      :height="`${props.height}px`"
      :column="column"
      :row="row"
      :class="cn('border-b', props.class)"
    />
  </tr>
</template>

<style scoped>
svg {
  display: inline-block;
  height: 12px;
  margin-top: -3px;
}
</style>
