<script setup lang="ts">
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import Loading from '@/components/UIComponents/Loading.vue'

const props = defineProps<{
  fileId: string
  label?: string
}>()

const { state: link } = useAsyncState(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return await apiClient.file.fileGetUrl.query({ id: props.fileId })
}, null)
</script>

<template>
  <Loading
    v-if="!link"
    color="primary"
  />
  <a
    v-else
    :href="link"
    download
    target="_blank"
    rel="noopener noreferrer"
    class="text-primary-500 flex"
  >
    <slot><ArrowDownTrayIcon class="h-5 w-5 mr-1" />{{ label ?? 'Herunterladen' }}</slot>
  </a>
</template>
