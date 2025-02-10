<script setup lang="ts">
import { defineProps } from 'vue'

import { useDataGridRowCell, type TDataGridRowCellProps, cn } from '@codeanker/datagrid'

const props = defineProps<TDataGridRowCellProps>()

const { formattedValue, cellProps, cellEmits } = useDataGridRowCell(props)
</script>

<template>
  <!-- am besten hier kein padding (oben und unten) rein packen, da sich der content dann nicht zwangsweise an der höhe ausrichtet-->
  <td :class="cn('flex items-center px-4', props.class)">
    <component
      :is="props.column.cell"
      v-bind="cellProps() ?? {}"
      v-if="props.column.cell"
      :column="props.column"
      :row="props.row"
      :formatted-value="formattedValue"
      v-on="cellEmits() ?? {}"
    />
    <span
      v-else
      class="truncate"
      >{{ formattedValue }}</span
    >
  </td>
</template>
