<script lang="ts" setup>
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'
import Button from './Button.vue'

defineProps<{
  description?: string
}>()

defineEmits<{
  confirm: void
}>()
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger aria-label="Open Filter"> <slot></slot> </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        side="bottom"
        :side-offset="5"
        class="z-40 rounded-md p-3 w-[260px] dark:bg-dark-secondary dark:text-white bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
      >
        <div class="space-y-4">
          <div>
            {{ description }}
          </div>
          <div class="flex justify-end gap-3 items-center">
            <PopoverClose>
              <div class="hover:underline cursor-pointer">Abbrechen</div>
            </PopoverClose>
            <Button
              color="danger"
              @click="$emit('confirm')"
              >Löschen</Button
            >
          </div>
        </div>
        <PopoverArrow class="fill-white dark:fill-dark-secondary" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
