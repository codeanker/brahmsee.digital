<script setup lang="ts">
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import AnmeldungStatusSelect from '@/components/AnmeldungStatusSelect.vue'
import { dayjs } from '@codeanker/helpers'

const props = withDefaults(
  defineProps<{
    personId: number
  }>(),
  {}
)

const { state: anmeldungenPerson } = useAsyncState(
  async () => {
    return await apiClient.anmeldung.gliederungGet.query({ personId: props.personId })
  },
  null,
  {
    immediate: true,
  }
)
</script>

<template>
  <div v-if="anmeldungenPerson">
    <div
      v-for="anmeldung in anmeldungenPerson"
      :key="anmeldung.id"
      class="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 py-4 border-t border-b border-gray-200"
    >
      <div>
        <div class="flex space-x-1 items-center">
          <span>{{ anmeldung.unterveranstaltung.veranstaltung.name }}</span>
          <RouterLink
            target="_blank"
            class="text-primary-600 hover:text-primary-700"
            :to="{
              name: 'UnterveranstaltungDetail',
              params: { unterveranstaltungId: anmeldung.unterveranstaltung.id },
            }"
          >
            <ArrowTopRightOnSquareIcon class="h-4 w-4" />
          </RouterLink>
        </div>
        <span class="text-gray-500 text-sm"
          >angemeldet am {{ dayjs(anmeldung.createdAt).format('DD.MM.YYYY') }} um
          {{ dayjs(anmeldung.createdAt).format('hh:mm') }}</span
        >
      </div>
      <div v-if="anmeldung.tshirtBestellt">T-Shirt Größe {{ anmeldung.person.konfektionsgroesse }}</div>
      <div>
        <AnmeldungStatusSelect
          :id="anmeldung.id"
          :status="anmeldung.status"
          :meldeschluss="anmeldung.unterveranstaltung.veranstaltung.meldeschluss"
        />
      </div>
    </div>
  </div>
  <div v-if="!anmeldungenPerson || anmeldungenPerson.length <= 0">
    Die Person hat sich zu keiner Veranstaltung angemeldet
  </div>
</template>
