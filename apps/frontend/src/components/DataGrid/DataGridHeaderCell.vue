<script setup lang="ts">
import { FunnelIcon as FunnelIconOutline } from '@heroicons/vue/24/outline'
import { Bars3CenterLeftIcon, BarsArrowDownIcon, BarsArrowUpIcon, FunnelIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'

import {
  useDataGridHeaderCell,
  type TDataGridHeaderCellEmits,
  type TDataGridHeaderCellProps,
  cn,
} from '@codeanker/datagrid'

const props = defineProps<TDataGridHeaderCellProps>()
const emit = defineEmits<TDataGridHeaderCellEmits>()

const { $el, resizeHandle, filter, handleClickOrderBy } = useDataGridHeaderCell(props, emit)
</script>

<template>
  <td
    ref="$el"
    :class="cn('bg-background text-gray-500 relative flex items-center border-b px-4 select-none', props.class)"
  >
    <span class="py-2 truncate">{{ title }}</span>
    <div class="ml-auto flex gap-1">
      <button
        v-if="column.sortable"
        type="button"
        variant="ghost"
        class="my-0 px-0"
        @click="handleClickOrderBy"
      >
        <BarsArrowDownIcon
          v-if="props.orderBy === 'asc'"
          class="h-4"
          aria-hidden="true"
        />
        <BarsArrowUpIcon
          v-else-if="props.orderBy === 'desc'"
          class="h-4"
          aria-hidden="true"
        />
        <Bars3CenterLeftIcon
          v-else
          class="h-4 w-4"
          aria-hidden="true"
        />
      </button>
      <PopoverRoot v-if="column.filter">
        <PopoverTrigger aria-label="Open Filter">
          <FunnelIcon
            v-if="filter"
            class="h-4"
            aria-hidden="true"
          />
          <FunnelIconOutline
            v-else
            class="h-4 w-4"
            aria-hidden="true"
          />
        </PopoverTrigger>
        <PopoverPortal>
          <PopoverContent
            side="bottom"
            :side-offset="5"
            class="z-40 rounded p-3 w-[260px] dark:bg-dark-secondary bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
          >
            <div class="flex justify-between items-start mb-2">
              <span class="text-sm dark:text-white font-semibold">{{ title }}</span>

              <PopoverClose aria-label="Close">
                <XMarkIcon class="h-4 w-4" />
              </PopoverClose>
            </div>
            <component
              :is="column.filter.component"
              v-bind="column.filter.props"
              v-model="filter"
            />
            <PopoverArrow class="fill-white dark:fill-dark-secondary" />
          </PopoverContent>
        </PopoverPortal>
      </PopoverRoot>
    </div>
    <div
      ref="resizeHandle"
      class="resize-handle absolute bottom-0 right-0 top-0 z-10 w-3 cursor-col-resize"
    />
  </td>
</template>
