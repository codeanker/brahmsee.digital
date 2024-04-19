<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import UnterveranstaltungenTable from '@/components/UnterveranstaltungenTable.vue'
</script>

<template>
  <div class="flex items-center justify-between my-8">
    <div class="flex flex-col">
      <h5 class="mb-0">Ausschreibungen</h5>
      <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten einer Ausschreibung die entsprechende Zeile anklicken.</p>
    </div>
    <RouterLink
      class="text-primary-500 flex items-center"
      :to="{ name: 'UnterveranstaltungCreate' }"
    >
      <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
      Ausschreibung erstellen
    </RouterLink>
  </div>
  <UnterveranstaltungenTable :columns="['veranstaltung']" />
</template>
