<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons'

defineProps<{
  title?: string
  subtitle?: string
}>()

const emit = defineEmits(['back'])
</script>

<template>
  <div class="pt-4 pb-4">
    <div
      class="flex h-16 items-center rounded-lg bg-gray-50 p-2"
      @click="emit('back')"
    >
      <div class="shrink-0 px-2">
        <div class="p-2">
          <FontAwesomeIcon
            :icon="faChevronLeft"
            class="text-primary-900"
            size="xl"
          />
        </div>
      </div>
      <div>
        <div
          v-if="subtitle"
          class="text-sm text-gray-400"
        >
          {{ subtitle }}
        </div>
        <div
          class="font-bold"
          :class="{ 'text-lg': !subtitle }"
        >
          {{ title }}
        </div>
        <slot
          v-if="$slots.content"
          name="content"
        />
      </div>
    </div>
  </div>
</template>
