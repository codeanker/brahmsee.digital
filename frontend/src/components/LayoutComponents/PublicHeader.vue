<script setup lang="ts">
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'

import Button from '../UIComponents/Button.vue'

import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'

// const { execute: fetchGliederung, state: gliederung } = useAsyncState(async () => {
//   return apiClient.gliederung.publicGet.query({ id: gliederungsId })
// }, undefined)
// fetchGliederung()
</script>

<template>
  <div class="flex items-center top-0 sticky bg-white z-10 justify-between mb-4 py-6">
    <GliederungLogo name="Moin" />
    <Button
      color="secondary"
      title="Kontaktiere uns"
    >
      <ChatBubbleOvalLeftEllipsisIcon class="h-5" />
    </Button>
  </div>
</template>
