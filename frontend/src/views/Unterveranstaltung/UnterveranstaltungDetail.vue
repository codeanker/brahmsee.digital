<script setup lang="ts">
import { useAsyncState, formatDate } from '@vueuse/core'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'
import InfoList from '@/components/UIComponents/InfoList.vue'
import { loggedInAccount } from '@/composables/useAuthentication'

const route = useRoute()

const { state: unterveranstaltung } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN')
    return apiClient.unterveranstaltung.verwaltungGet.query({
      id: parseInt(route.params.unterveranstaltungId as string),
    })
  return apiClient.unterveranstaltung.gliederungGet.query({
    id: parseInt(route.params.unterveranstaltungId as string),
  })
}, undefined)

interface KeyInfo {
  title: string
  value: string
  small?: boolean
}

const keyInfos = computed<KeyInfo[]>(() => {
  if (unterveranstaltung.value) {
    return [
      {
        title: 'Beginn',
        value: `${formatDate(unterveranstaltung.value.veranstaltung.beginn, 'DD.MM.YYYY')} Uhr`,
      },
      {
        title: 'Ende',
        value: `${formatDate(unterveranstaltung.value.veranstaltung.ende, 'DD.MM.YYYY')} Uhr`,
      },
      { title: 'Meldeschluss', value: formatDate(unterveranstaltung.value.meldeschluss, 'DD.MM.YYYY') },
      { title: 'Veranstaltungsort', value: unterveranstaltung.value.veranstaltung.ort?.name ?? '' },
      { title: 'Teilnahmebeitrag', value: unterveranstaltung.value.teilnahmegebuehr + '€' },
      { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
    ]
  } else {
    return []
  }
})
</script>

<template>
  <div>
    <h5 class="mb-10">Ausschreibung Detail</h5>
    <InfoList :infos="keyInfos" />
    <div class="px-3 py-5">
      <div v-html="unterveranstaltung?.beschreibung" />
    </div>
    <Button :to="{ name: 'UnterveranstaltungEdit' }">Bearbeiten</Button>
  </div>
</template>
