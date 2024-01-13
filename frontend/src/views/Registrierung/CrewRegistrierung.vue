<script setup lang="ts">
import { FaceFrownIcon } from '@heroicons/vue/24/outline'

import Button from '@/components/UIComponents/Button.vue'
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
        <FaceFrownIcon class="h-14"></FaceFrownIcon> Oh nein
      </h2>
      <p class="text-center">Die Funktion steht leider noch nicht zur Verfügung.</p>
      <Button
        :to="{ name: 'Registrierung' }"
        color="primary"
        full
        class="mt-5"
        >zurück</Button
      >
    </div>
  </div>
</template>
