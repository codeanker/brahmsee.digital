<script setup lang="ts">
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/vue/24/outline'

import Button from '../UIComponents/Button.vue'
</script>

<template>
  <div class="flex items-center justify-between mb-10">
    <img
      src="@/assets/images/gliederung_test.png"
      class="h-12 lg:h-16"
    />
    <Button color="secondary">
      <ChatBubbleOvalLeftEllipsisIcon class="h-5" />
      <div class="hidden lg:inline-block ml-2">Kontaktiere uns</div>
    </Button>
  </div>
</template>
