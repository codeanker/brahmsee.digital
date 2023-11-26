<script setup lang="ts">
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import Button from '../UIComponents/Button.vue'

import { apiClient } from '@/api'
import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'

const props = defineProps<{
  gliederungsId: number
}>()

const { execute: fetchGliederung, state: gliederung } = useAsyncState(async () => {
  return apiClient.gliederung.publicGet.query({ gliederungId: props.gliederungsId })
}, undefined)
fetchGliederung()
</script>

<template>
  <div class="flex items-center top-0 sticky bg-white z-10 justify-between mb-4 py-6">
    <GliederungLogo
      v-if="gliederung"
      :name="gliederung?.name"
    />
    <Button
      color="secondary"
      title="Kontaktiere uns"
    >
      <ChatBubbleOvalLeftEllipsisIcon class="h-5" />
    </Button>
  </div>
</template>
