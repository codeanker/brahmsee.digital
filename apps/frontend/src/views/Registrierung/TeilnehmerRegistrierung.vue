<script setup lang="ts">
import { CheckCircleIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Stammdaten, { type IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import ButtonCard from '@/components/UIComponents/ButtonCard.vue'
import IscBadge from '@/components/IscBadge.vue'
import Modal from '@/components/UIComponents/Modal.vue'
import Loading from '@/components/UIComponents/Loading.vue'

const iscModal = ref<InstanceType<typeof Modal>>()
const defaultModal = ref<InstanceType<typeof Modal>>()

const stammdatenForm = ref<IStammdaten>({
  firstname: '',
  lastname: '',
  gender: 'MALE',
  birthday: null,
})

const registrationForm = ref<{
  dataprivacy?: boolean
  email?: string
  gliederung?: { id: number; name: string }
  password?: string
}>({})

async function queryObject(searchTerm) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}

const errorCreate = ref<unknown | null>(null)
const account = ref<null | Awaited<RouterOutput['account']['teilnehmerCreate']>>(null)

async function watiForOAuth(): Promise<string> {
  const channel = new BroadcastChannel('auth')
  return new Promise((resolve, reject) => {
    channel.addEventListener('message', (event) => {
      if (event.data.jwtOAuthToken) {
        resolve(event.data.jwtOAuthToken)
      } else {
        reject(new Error('no jwtOAuthToken'))
      }
    })
  })
}

type TAccountData = RouterInput['account']['teilnehmerCreate']['data']

async function registerGliederung() {
  try {
    account.value = null
    errorCreate.value = null
    const accountData: TAccountData = {
      firstname: stammdatenForm.value.firstname,
      lastname: stammdatenForm.value.lastname,
      gender: stammdatenForm.value.gender,
      birthday: stammdatenForm.value.birthday ?? new Date(),
      email: registrationForm.value.email,
      password: registrationForm.value.password,
      gliederungId: registrationForm.value.gliederung!.id,
    }

    if (oauthRegistration.value) {
      // first optain jwt containing the oauth sub id
      // open new tab with oauth login

      const origin = `${location.href}/api`
      const oauthHref = `/api/connect/dlrg?mode=register&origin=${encodeURIComponent(origin)}`
      window.open(oauthHref, '_blank')

      accountData.jwtOAuthToken = await watiForOAuth()
      accountData.password = undefined
      accountData.email = undefined
    }

    account.value = await apiClient.account.teilnehmerCreate.mutate({
      data: accountData as unknown as RouterInput['account']['teilnehmerCreate']['data'],
    })
  } catch (error) {
    errorCreate.value = error
  }
}
const oauthRegistration = ref()
</script>

<template>
  <div class="h-svh flex flex-col items-center w-full p-6 lg:p-0">
    <!-- Modals -->
    <Modal
      ref="iscModal"
      size="xl"
    >
      <template #content>
        <div class="flex items-center justify-center space-x-4">
          <Loading
            color="primary"
            size="md"
          />
          <span>
            Du wirst nun in das ISC weitergeleitet. Bitte melde dich dort mit deinem DLRG-Account an und bestätige die
            Registrierung.
          </span>
        </div>
      </template>
    </Modal>

    <Modal
      ref="defaultModal"
      size="xl"
    >
      <template #content>
        <ValidateForm
          v-if="!account"
          class="grow"
          @submit="registerGliederung"
        >
          <Stammdaten v-model="stammdatenForm" />
          <hr class="my-5" />
          <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
            <BasicTypeahead
              v-model="registrationForm.gliederung"
              :query="queryObject"
              :input-formatter="(result) => result?.name"
              :result-formatter="(result) => result.name"
              :strict="true"
              label="Gliederung"
              class="col-span-2"
              required
              placeholder="Gliederung eingeben"
            />
            <BasicInput
              v-if="!oauthRegistration"
              v-model="registrationForm.email"
              label="E-Mail Adresse"
              class="col-span-2"
              type="email"
              required
              placeholder="E-Mail Adresse eingeben"
            />
            <BasicPassword
              v-if="!oauthRegistration"
              v-model="registrationForm.password"
              label="Passwort"
              class="col-span-2"
              required
              placeholder=""
            />
          </div>
          <hr class="my-5" />
          <div
            v-if="errorCreate"
            class="bg-danger-400 mb-5 rounded p-3 text-center text-white"
          >
            {{ errorCreate }}
          </div>
          <Button
            type="submit"
            color="primary"
            full
          >
            Anmelden
          </Button>
        </ValidateForm>
        <div
          v-else
          class="flex flex-col justify-center items-center text-center space-y-4 py-8"
        >
          <CheckCircleIcon class="w-14 h-14 text-primary-700" />
          <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
            Registrierung erfolgreich
          </h2>
          <div>
            Du hast Dich erfolgreich registriert. Wir haben dir eine E-Mail mit einem Bestätigungslink geschickt.
          </div>
        </div>
      </template>
    </Modal>

    <div class="flex h-full flex-col lg:justify-center w-full lg:max-w-xl space-y-12">
      <div class="flex">
        <RouterLink
          :to="{ name: 'Registrierung' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600 space-x-1"
        >
          <ChevronLeftIcon class="h-5 w-5" />
          <span>Zurück</span>
        </RouterLink>
      </div>

      <!-- Title Header -->
      <div class="flex flex-col items-center justify-center relative">
        <h2 class="text-center text-4xl text-primary-700">Registrierung als Teilnehmer</h2>
        <p class="text-center">Wie möchtest Du dich registrieren?</p>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <ButtonCard
          :badge="IscBadge"
          title="Mit DLRG-Account"
          description="Registriere dich bequem mit deinem bestehenden DLRG-Account."
          @click="iscModal.show()"
        />
        <ButtonCard
          title="Mit E-Mail und Passwort"
          description="Registriere dich mit deiner E-Mail Adresse und einem Passwort."
          @click="defaultModal.show()"
        />
      </div>
    </div>
  </div>
</template>
