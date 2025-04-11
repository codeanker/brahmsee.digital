<script setup lang="ts">
import DataGridRowCell from './DataGridRowCell.vue'

import { type TDataGridRowProps, type TDataGridRowEmits, cn } from '@codeanker/datagrid'

const props = defineProps<TDataGridRowProps>()
const emit = defineEmits<TDataGridRowEmits>()
</script>

<template>
  <!-- display: contents da die grid auf die cells angewendet werden soll, darum können border usw. nicht darauf angewendet werden -->
  <tr
    class="contents"
    @click="emit('rowClick', row)"
    @dblclick="emit('rowDblClick', row)"
  >
    <DataGridRowCell
      v-for="column in columns"
      :key="`${column.field}-${row.id}`"
      :height="`${props.height}px`"
      :column="column"
      :row="row"
      :class="cn('border-b dark:border-b-white/40', props.class)"
    />
  </tr>
</template>
