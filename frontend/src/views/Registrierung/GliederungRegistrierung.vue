<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { CheckIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Stammdaten, { type IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import type { TAccountSchema } from '@codeanker/api/src/services/account/schema/account.schema'
import { ValidateForm } from '@codeanker/validation'

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
  return apiClient.gliederung.publicList.query({ filter: { name: searchTerm }, pagination: { take: 100, skip: 0 } })
}

const errorCreate = ref<unknown | null>(null)
const account = ref<null | Awaited<RouterOutput['account']['gliederungAdminCreate']>>(null)

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

type TAccountData = Partial<TAccountSchema> & {
  jwtOAuthToken?: string
}

async function registerGliederung() {
  try {
    account.value = null
    errorCreate.value = null
    let accountData: TAccountData = {
      firstname: stammdatenForm.value.firstname,
      lastname: stammdatenForm.value.lastname,
      gender: stammdatenForm.value.gender,
      birthday: stammdatenForm.value.birthday ? new Date(stammdatenForm.value.birthday) : undefined,
      email: registrationForm.value.email,
      password: registrationForm.value.password,
      adminInGliederungId: registrationForm.value.gliederung?.id,
    }

    if (oauthRegistration.value) {
      // first optain jwt containing the oauth sub id
      // open new tab with oauth login
      window.open('/api/connect/dlrg?mode=register', '_blank')

      accountData.jwtOAuthToken = await watiForOAuth()
      accountData.password = undefined
      accountData.email = undefined
    }

    account.value = await apiClient.account.gliederungAdminCreate.mutate({
      data: accountData as unknown as RouterInput['account']['gliederungAdminCreate']['data'],
    })
  } catch (error) {
    errorCreate.value = error
  }
}
const oauthRegistration = ref()
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div v-if="!account">
      <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
        Registrierung als Gliederung
      </h2>
      <p class="text-center">Erstelle Ausschreibungen und versende diese zur Anmeldung und verwalte diese.</p>

      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 my-5">
        <div
          class="relative w-full p-5 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-500 group"
          :class="{ 'border-primary-500': oauthRegistration }"
          @click="oauthRegistration = true"
        >
          <CheckIcon
            class="shrink-0 h-6 w-6 bg-primary-500 rounded-full p-1 text-white mr-2 opacity-0"
            :class="{ 'opacity-100': oauthRegistration }"
          ></CheckIcon>
          <div class="">
            <div
              class="font-medium text-lg transition-all ease-in-out group-hover:text-primary-500"
              :class="{ 'text-primary-500': oauthRegistration }"
            >
              mit DLRG-Account (ISC)
            </div>
            <div>Registriere dich bequem mit deinem DLRG-Account (ISC)</div>
          </div>
        </div>
        <div
          class="relative w-full p-5 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-500 group"
          :class="{ 'border-primary-500': oauthRegistration == false }"
          @click="oauthRegistration = false"
        >
          <CheckIcon
            class="shrink-0 h-6 w-6 bg-primary-500 rounded-full p-1 text-white mr-2 opacity-0"
            :class="{ 'opacity-100': oauthRegistration == false }"
          ></CheckIcon>
          <div class="">
            <div
              class="font-medium text-lg transition-all ease-in-out group-hover:text-primary-500"
              :class="{ 'text-primary-500': oauthRegistration == false }"
            >
              mit E-Mail und Passwort
            </div>
            <div>Registriere dich mit deiner E-Mail Adresse und einem Passwort</div>
          </div>
        </div>
      </div>

      <div
        v-if="oauthRegistration !== undefined"
        class="h-full grow mt-5 lg:mt-10"
      >
        <!-- Form -->
        <ValidateForm
          class="grow"
          @submit="registerGliederung"
        >
          <Stammdaten v-model="stammdatenForm"></Stammdaten>
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
          <div class="flex items-start mb-5 space-x-3">
            <BasicCheckbox
              v-model="registrationForm.dataprivacy"
              required
              class="mt-1"
            />
            <div class="font-medium">
              Ich habe die
              <RouterLink
                :to="{ name: 'Datenschutz' }"
                target="_blank"
                rel="noopener noreferrer"
                >Datenschutzerklärung</RouterLink
              >
              gelesen und akzeptiere diese.
            </div>
          </div>

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
            >Anmelden
          </Button>
        </ValidateForm>
        <RouterLink
          :to="{ name: 'Registrierung' }"
          class="mt-5 flex justify-center text-sm transition-all text-gray-500 hover:text-primary-500"
        >
          zurück
        </RouterLink>
      </div>
    </div>
    <div
      v-if="account"
      class="grow justify-center items-center flex flex-col text-center space-y-3"
    >
      <CheckCircleIcon class="w-14 h-14 text-primary-700" />
      <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
        Registrierung erfolgreich
      </h2>
      <div>Du hast Dich erfolgreich registriert. Wir haben dir eine E-Mail mit einem Bestätigungslink geschickt.</div>
    </div>
  </div>
</template>
