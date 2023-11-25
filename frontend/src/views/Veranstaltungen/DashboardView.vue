<script setup lang="ts">
import { BanknotesIcon, ClockIcon, MapPinIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
import { formatDate, useAsyncState } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import KeyValue from '@/components/UIComponents/KeyValue.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const route = useRoute()

watch(
  () => route.params.veranstaltungId,
  () => {
    veranstaltung.value = null
    execute()
  }
)

const {
  state: veranstaltung,
  execute,
  isLoading,
} = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungGet.query({ id: parseInt(route.params.veranstaltungId as string) })
}, null)
</script>

<template>
  <div>
    <div v-if="isLoading || !veranstaltung"><Loading color="primary" /> Loading...</div>
    <div v-else>
      <h2>{{ veranstaltung?.name }}</h2>
      <p class="text-gray-500">
        {{ formatDate(veranstaltung.beginn, 'DD.MM.YYYY') }} - {{ formatDate(veranstaltung.ende, 'DD.MM.YYYY') }}
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div class="col-span-1 lg:col-span-2 space-y-2">
          <KeyValue
            key-text="Veranstaltungsort"
            :value-text="veranstaltung.ort"
            :icon="MapPinIcon"
          ></KeyValue>
          <KeyValue
            key-text="Meldebeginn"
            :value-text="formatDate(veranstaltung.meldebeginn, 'DD.MM.YYYY')"
            :icon="ClockIcon"
          ></KeyValue>
          <KeyValue
            key-text="Meldeschluss"
            :value-text="formatDate(veranstaltung.meldeschluss, 'DD.MM.YYYY')"
            :icon="ClockIcon"
          ></KeyValue>
          <KeyValue
            key-text="Maximale Teilnehmeranzahl"
            :value-text="veranstaltung.maxTeilnehmende"
            :icon="UserGroupIcon"
          ></KeyValue>
          <KeyValue
            key-text="Teilnahmegebühr"
            :value-text="veranstaltung.teilnahmegebuehr + '€'"
            :icon="BanknotesIcon"
          >
          </KeyValue>
          <h3>Aussschreibung</h3>
          <pre>{{ veranstaltung }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
