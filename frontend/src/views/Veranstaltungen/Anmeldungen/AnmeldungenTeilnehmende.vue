<script setup lang="ts">
import { useRoute } from 'vue-router'

import { useVeranstaltung } from '../../../composables/useVeranstaltung'

import AnmeldungenTable from '@/components/AnmeldungenTable.vue'

const { veranstaltung } = useVeranstaltung()
const route = useRoute()
const veranstaltungId = Number(route.params.veranstaltungId)
</script>

<template>
  <div class="my-10 flex justify-between">
    <div>
      <div class="text-lg font-semibold">Teilnehmende "{{ veranstaltung?.name }}"</div>
      <p class="max-w-2xl text-sm">
        Hier findest Du alle Personen die sich zur Veranstaltung "{{ veranstaltung?.name }}" angemeldet haben.
      </p>
    </div>
  </div>

  <AnmeldungenTable
    v-if="veranstaltung"
    :veranstaltung-id="veranstaltungId"
    :show-stats="true"
  />
</template>
