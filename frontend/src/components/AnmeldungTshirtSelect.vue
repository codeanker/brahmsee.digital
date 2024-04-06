<script setup lang="ts">
import { ref, watch } from 'vue'

import type { ITShirtBestellung } from './forms/person/FormTShirtBestellungGeneral.vue'
import FormTShirtBestellungGeneral from './forms/person/FormTShirtBestellungGeneral.vue'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import type { RouterOutput } from '@codeanker/api'

type Anmeldung =
  | Awaited<RouterOutput['anmeldung']['verwaltungGet']>[number]
  | Awaited<RouterOutput['anmeldung']['gliederungGet']>[number]
type Person = Awaited<RouterOutput['person']['verwaltungGet']> | Awaited<RouterOutput['person']['gliederungGet']>

const props = withDefaults(
  defineProps<{
    anmeldung?: Anmeldung
    person?: Person
  }>(),
  {}
)

const emit = defineEmits<{
  (event: 'changed'): void
}>()

const data = ref<ITShirtBestellung>({
  bestellen: props.anmeldung?.tshirtBestellt ?? false,
  groesse: props.person?.konfektionsgroesse ?? 'M',
})

// quick and dirty
watch(
  data,
  async (value: ITShirtBestellung) => {
    if (loggedInAccount.value?.role === 'ADMIN') {
      await apiClient.person.tshirtVerwaltungPatch.mutate({
        anmeldungId: props.anmeldung!.id,
        bestellen: value.bestellen,
        groesse: value.groesse,
      })
    } else if (loggedInAccount.value?.role === 'GLIEDERUNG_ADMIN') {
      await apiClient.person.tshirtGliederungPatch.mutate({
        anmeldungId: props.anmeldung!.id,
        bestellen: value.bestellen,
        groesse: value.groesse,
      })
    }

    emit('changed')
  },
  { deep: true }
)
</script>

<template>
  <FormTShirtBestellungGeneral
    v-model="data"
    hide-title
  />
</template>
