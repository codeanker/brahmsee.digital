<script setup lang="ts">
import { CodeBracketIcon, TicketIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormAnmeldungGeneral from '@/components/forms/anmeldung/FormAnmeldungGeneral.vue'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import UserLogo from '@/components/UIComponents/UserLogo.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { type NahrungsmittelIntoleranz } from '@codeanker/api'

const route = useRoute()

const { setTitle } = useRouteTitle()

watch(route, () => {
  refetchPerson()
})

const {
  state: person,
  execute: refetchPerson,
  isLoading: isLoading,
} = useAsyncState(async () => {
  const personId = route.params.personId as string
  const result = await apiClient.person.get.query({ id: parseInt(personId) })
  setTitle(`Person: ${result.firstname} ${result.lastname}`)
  return result
}, null)

const { execute: update } = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranz)

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
  <div class="mx-auto lg:mx-0 mb-6 flex items-center space-x-4">
    <div class="w-20 h-20 shrink-0">
      <UserLogo
        v-if="person?.firstname && person?.lastname"
        :firstname="person?.firstname"
        :lastname="person?.lastname"
        :edit="true"
        :person-id="person.id"
        :photo-id="person.photoId"
        size="xl"
        @trigger-refresh="refetchPerson"
      />
    </div>
    <div class="mb-1">
      <h2 class="text-xl font-bold tracking-tight sm:text-2xl mb-0">
        <span>{{ person?.firstname }} {{ person?.lastname }}</span>
      </h2>
      <p class="mb-0">{{ person?.gliederung?.name }}</p>
    </div>
  </div>

  <Tabs
    content-space="4"
    :tabs="tabs"
  >
    <Tab>
      <div class="text-lg font-semibold mb-6">Stammdaten</div>
      <FormPersonGeneral
        v-if="person"
        :is-loading="isLoading"
        :person="person"
        :error="undefined"
        @submit="(data) => update(undefined, data)"
      />
    </Tab>
    <Tab>
      <div class="text-lg font-semibold">Anmeldungen</div>
      <p class="max-w-2xl text-sm mb-6">Informationen zu Anmeldungen</p>
      <FormAnmeldungGeneral
        v-if="person"
        :person-id="person.id"
      />
    </Tab>
    <Tab v-if="loggedInAccount?.role === 'ADMIN'">
      <div class="text-lg font-semibold">Entwickler:innen</div>
      <p class="max-w-2xl text-sm mb-6">Informationen für Entwickler:innen</p>
      <pre>{{ person }}</pre>
    </Tab>
  </Tabs>
</template>
