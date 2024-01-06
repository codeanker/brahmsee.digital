<script setup lang="ts">
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Stammdaten, { type IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import { ValidateForm } from '@codeanker/validation'

const stammdatenForm = ref<IStammdaten>({})

const registrationForm = ref<{
  name?: string
  dataprivacy?: boolean
  email?: string
  gliederung?: string
}>({})

async function queryObject(searchTerm) {
  return apiClient.gliederung.publicList.query({ filter: { name: searchTerm }, pagination: { take: 100, skip: 0 } })
}

function submit() {
  // eslint-disable-next-line
  console.log(stammdatenForm.value)
  // eslint-disable-next-line
  console.log(registrationForm.value)
}
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40">
    <!-- Header -->
    <PublicHeader />
    <div class="text-3xl font-medium">Registrierung als Gliederung</div>
    <div class="mb-5">Registriere dich als Gliederung</div>
    <!-- Form -->
    <ValidateForm @submit="submit">
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
          required
          placeholder="E-Mail Adresse eingeben"
        />
      </div>
      <hr class="my-5" />
      <div class="flex items-start mb-10 space-x-3">
        <BasicCheckbox
          v-model="registrationForm.dataprivacy"
          required
          class="mt-1"
        />
        <div class="font-medium">Ich habe die Datenschutzerklärung gelesen und akzeptiere diese.</div>
      </div>
      <Button
        type="submit"
        color="primary"
        class="w-full lg:w-auto justify-center mb-20"
        >Anmelden</Button
      >
    </ValidateForm>
    <div class="flex items-center justify-between">
      <img
        class="h-8"
        src="@/assets/images/gliederung_sh.png"
      />
      <div class="text-sm text-gray-500 text-right">v1.0.0-#123456</div>
    </div>
  </div>
</template>
