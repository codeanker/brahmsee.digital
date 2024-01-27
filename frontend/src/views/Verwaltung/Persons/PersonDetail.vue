<script setup lang="ts">
import { CodeBracketIcon, TicketIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormAnmeldungGeneral from '@/components/forms/anmeldung/FormAnmeldungGeneral.vue'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import type { NahrungsmittelIntoleranzEnum } from '@codeanker/api/src/enumMappings'

const route = useRoute()

const {
  state: person,
  execute: refetchPerson,
  isLoading: isLoading,
} = useAsyncState(async () => {
  const personId = route.params.personId as string
  return await apiClient.person.verwaltungGet.query({ id: parseInt(personId) })
}, null)

const { execute: update } = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranzEnum)

    await apiClient.person.verwaltungPatch.mutate({
      id: person.value!.id,
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

        konfektionsgroesse: anmeldung.tshirt.groesse,
      },
    })

    await refetchPerson()
  },
  null,
  {
    immediate: false,
  }
)

const tabs = [
  { name: 'Stammdaten', icon: UserIcon },
  { name: 'Anmeldungen', icon: TicketIcon },
]

if (loggedInAccount.value?.role === 'ADMIN') {
  tabs.push({ name: 'Entwickler:in', icon: CodeBracketIcon })
}
</script>

<template>
  <h5 class="mb-10">Person: {{ person?.firstname }} {{ person?.lastname }}</h5>
  <div class="bg-white pt-2 pb-8">
    <div class="mx-auto max-w-xl lg:mx-0">
      <h2 class="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
        {{ person?.firstname }} {{ person?.lastname }}
      </h2>
      <p class="mt-2 text-md leading-6 text-gray-600">
        Bearbeite die Stammdaten der Person, gleichzeitig kannst Du alle Anmeldungen der Person einsehen.
      </p>
    </div>
  </div>

  <Tabs
    content-space="4"
    :tabs="tabs"
  >
    <Tab>
      <div class="flex justify-between items-center mt-5 lg:mt-10 mb-5">
        <div class="text-lg font-semibold text-gray-900">Stammdaten</div>
      </div>
      <FormPersonGeneral
        v-if="person"
        :is-loading="isLoading"
        :person="person"
        :error="undefined"
        @submit="(data) => update(undefined, data)"
      />
    </Tab>
    <Tab>
      <div class="my-10">
        <div class="text-lg font-semibold text-gray-900">Anmeldungen</div>
        <p class="max-w-2xl text-sm text-gray-500">Informationen zu Anmeldungen</p>
      </div>
      <FormAnmeldungGeneral
        v-if="person"
        :person-id="person.id"
      ></FormAnmeldungGeneral>
    </Tab>
    <Tab v-if="loggedInAccount?.role === 'ADMIN'">
      <div class="my-10">
        <div class="text-lg font-semibold text-gray-900">Entwickler:innen</div>
        <p class="max-w-2xl text-sm text-gray-500">Informationen für Entwickler:innen</p>
      </div>
      <pre>{{ person }}</pre>
    </Tab>
  </Tabs>
</template>
