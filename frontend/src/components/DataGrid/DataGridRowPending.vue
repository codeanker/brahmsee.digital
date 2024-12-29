<script setup lang="ts">
import { type TDataGridRowProps, cn } from '@codeanker/datagrid'

const props = defineProps<TDataGridRowProps>()
</script>

<template>
  <tr class="contents">
    <td
      v-for="column in props.columns"
      :key="`${column.field}-${props.row.id}`"
      role="status"
      :class="cn('flex w-full animate-pulse select-none items-center', props.class)"
    >
      <div class="mx-2 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
    </td>
  </tr>
</template>
