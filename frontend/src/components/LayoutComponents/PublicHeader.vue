<script setup lang="ts">
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'

import Button from '../UIComponents/Button.vue'

import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'

interface Gliederung {
  name?: string
}

defineProps<{
  gliederung?: Gliederung
}>()
</script>

<template>
  <div class="flex items-center top-0 sticky bg-white z-10 justify-between mb-4 py-6">
    <GliederungLogo :name="gliederung?.name ? gliederung?.name : ''" />
    <Button
      color="secondary"
      title="Kontaktiere uns"
    >
      <ChatBubbleOvalLeftEllipsisIcon class="h-5" />
    </Button>
  </div>
</template>
