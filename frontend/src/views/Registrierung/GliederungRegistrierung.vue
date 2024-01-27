<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Stammdaten, { type IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput } from '@codeanker/api'
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

const {
  execute: registerGliederung,
  error: errorCreate,
  state: account,
} = useAsyncState(
  async () => {
    let accountData = <Partial<TAccountSchema>>{
      firstname: stammdatenForm.value.firstname,
      lastname: stammdatenForm.value.lastname,
      gender: stammdatenForm.value.gender,
      birthday: stammdatenForm.value.birthday,
      email: registrationForm.value.email,
      password: registrationForm.value.password,
      adminInGliederungId: registrationForm.value.gliederung?.id,
    }
    return await apiClient.account.gliederungAdminCreate.mutate({
      data: accountData as unknown as RouterInput['account']['gliederungAdminCreate']['data'],
    })
  },
  null,
  { immediate: false }
)
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div v-if="!account">
      <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
        Registrierung als Gliederung
      </h2>
      <p class="text-center">Erstelle Ausschreibungen und versende diese zur Anmeldung und verwalte diese.</p>

      <div class="h-full grow mt-5 lg:mt-10">
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
              v-model="registrationForm.email"
              label="E-Mail Adresse"
              class="col-span-2"
              type="email"
              required
              placeholder="E-Mail Adresse eingeben"
            />
            <BasicPassword
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
            <div class="font-medium">Ich habe die Datenschutzerklärung gelesen und akzeptiere diese.</div>
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
          class="mt-5 flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600"
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
