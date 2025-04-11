<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { useVeranstaltung } from '../../../composables/useVeranstaltung'

import AnmeldungenTable from '@/components/data/AnmeldungenTable.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'

const { veranstaltung } = useVeranstaltung()
const { setTitle } = useRouteTitle()

setTitle('Teilnehmende Personen')
</script>

<template>
  <div class="flex items-center justify-between pb-6">
    <div class="flex flex-col">
      <p class="text-sm">
        Hier findest Du alle Personen, die sich zur Veranstaltung "{{ veranstaltung?.name }}" angemeldet haben.
      </p>
    </div>
    <RouterLink
      class="text-primary-500 flex items-center"
      :to="{ name: 'VeranstaltungAnmeldungenCreate' }"
    >
      <PlusIcon class="h-5 w-5 mr-1" />
      <span>Anmeldung erstellen</span>
    </RouterLink>
  </div>
  <AnmeldungenTable
    v-if="veranstaltung"
    :filter="{ type: 'veranstaltung', veranstaltungId: veranstaltung.id }"
    :show-stats="true"
  />
</template>
