<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import UnterveranstaltungenTable from '@/components/UnterveranstaltungenTable.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { setTitle } = useRouteTitle()

setTitle('Ausschreibungen')
</script>

<template>
  <div class="flex items-center justify-between pb-6">
    <div class="flex flex-col">
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
