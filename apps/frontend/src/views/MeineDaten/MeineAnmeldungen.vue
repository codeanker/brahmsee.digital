<script setup lang="ts">
import AnmeldungenTable from '@/components/data/AnmeldungenTable.vue'
import { LinkIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <div class="my-4 flex items-center justify-between">
    <div>
      <p class="text-xl font-bold">Anmeldungen</p>
      <p class="text-sm">Hier findest Du alle deine Anmeldungen.</p>
    </div>

    <RouterLink
      class="text-primary-500 flex items-center"
      :to="{ name: 'Anmeldung zuordnen' }"
    >
      <LinkIcon class="h-5 w-5 mr-1" />
      <span>Zuordnungscode eingeben</span>
    </RouterLink>
  </div>

  <AnmeldungenTable :filter="{ type: 'own' }" />
</template>
