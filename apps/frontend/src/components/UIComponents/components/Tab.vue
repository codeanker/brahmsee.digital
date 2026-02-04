<script setup lang="ts">
import { TabPanel } from '@headlessui/vue'

defineProps<{
  fullWidth?: boolean
}>()
</script>

<template>
  <TabPanel>
    <div
      :class="fullWidth ? 'grid-cols-1' : 'grid-cols-1'"
      class="grid"
    >
      <div><slot /></div>
    </div>
  </TabPanel>
</template>
