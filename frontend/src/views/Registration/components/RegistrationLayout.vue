<template>
  <BaseLayout class="container py-4">
    <BasicHeader
      class="mb-12"
      title="Wer bist du?"
      subtitle="Registrierung"
      @back="emit('back')"
    />

    <div class="mb-2 p-4 text-center">
      <h2>Wer bist du?</h2>
    </div>

    <div class="mb-7 text-center">
      <p>Hilf uns mehr über dich zu erfahren.</p>
    </div>
    <slot />
  </BaseLayout>
</template>

<script setup lang="ts">
import BasicHeader from '@/components/BasicHeader.vue'
import BaseLayout from '@/layouts/BaseLayout.vue'

const emit = defineEmits<{
  (event: 'back'): void
}>()
</script>
