<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useVeranstaltung } from '../../../composables/useVeranstaltung'

import AnmeldungenTable from '@/components/AnmeldungenTable.vue'

const { veranstaltung } = useVeranstaltung()
const route = useRoute()
const veranstaltungId = computed(() => Number(route.params.veranstaltungId))
</script>

<template>
  <div class="flex items-center justify-between gap-x-12 my-8">
    <div class="flex flex-col">
      <h5 class="mb-0">Teilnehmende "{{ veranstaltung?.name }}"</h5>
      <p class="text-sm">
        Hier findest Du alle Personen, die sich zur Veranstaltung "{{ veranstaltung?.name }}" angemeldet haben.
      </p>
    </div>
    <RouterLink
      class="text-primary-500 flex items-center"
      :to="{ name: 'VeranstaltungAnmeldungenCreate' }"
    >
      <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
      <span>Anmeldung erstellen</span>
    </RouterLink>
  </div>
  <AnmeldungenTable
    v-if="veranstaltung"
    :veranstaltung-id="veranstaltungId"
    :show-stats="true"
  />
</template>
