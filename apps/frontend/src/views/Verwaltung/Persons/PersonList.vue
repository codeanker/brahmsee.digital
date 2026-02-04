<script setup lang="ts">
import PersonTable from '@/components/data/PersonTable.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <p class="text-sm"><b>Tipp</b>: Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.</p>

    <RouterLink
      class="text-primary-500 flex items-center"
      :to="{ name: 'Verwaltung Person erstellen' }"
    >
      <PlusIcon class="h-5 w-5 mr-1" />
      <span>Person anlegen</span>
    </RouterLink>
  </div>

  <div class="grid-rows[1fr, 50px] grid flex-grow">
    <PersonTable />
  </div>
</template>
