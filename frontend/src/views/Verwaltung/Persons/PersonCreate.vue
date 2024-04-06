<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import router from '@/router'
import type { NahrungsmittelIntoleranz } from '@codeanker/api'

const { execute: create } = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranz)

    await apiClient.person.verwaltungCreate.mutate({
      data: {
        gliederungId: anmeldung.gliederung.id,
        firstname: anmeldung.stammdaten.firstname,
        lastname: anmeldung.stammdaten.lastname,
        gender: anmeldung.stammdaten.gender,
        birthday: anmeldung.stammdaten.birthday ?? new Date(),
        email: anmeldung.contact.email,
        telefon: anmeldung.contact.telefon,

        address: {
          ...anmeldung.address,
        },

        notfallkontaktPersonen: anmeldung.notfallKontakte.personen,
        essgewohnheit: anmeldung.essgewohnheiten.essgewohnheit,
        nahrungsmittelIntoleranzen,
        weitereIntoleranzen: anmeldung.essgewohnheiten.weitereIntoleranzen,
      },
    })

    router.back()
  },
  null,
  {
    immediate: false,
  }
)
</script>

<template>
  <h5>Person erstellen</h5>
  <div class="mt-5 lg:mt-10">
    <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
    <FormPersonGeneral
      :is-loading="false"
      @submit="(data) => create(undefined, data)"
    />
  </div>
</template>
