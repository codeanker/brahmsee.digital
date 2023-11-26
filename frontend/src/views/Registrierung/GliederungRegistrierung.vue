<script setup lang="ts">
import { PlusSmallIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Stammdaten, { type IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import { ValidateForm } from '@codeanker/validation'

const stammdatenForm = ref<IStammdaten>({})
const registrationForm = ref({})

function submit() {
  // eslint-disable-next-line
  console.log(registrationForm.value)
}
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40">
    <!-- Header -->
    <PublicHeader />
    <div class="text-3xl font-medium">Registrierung</div>
    <div class="mb-5">Als Gliederung zum Landeskindertreffen am Brahmsee 2023</div>
    <!-- Form -->
    <ValidateForm @submit="submit">
      <Stammdaten v-model="stammdatenForm"></Stammdaten>
      <hr class="my-5" />
      <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
        <BasicInput
          v-model="registrationForm.name"
          label="E-Mail Adresse"
          placeholder="E-Mail Adresse eingeben"
        />
        <BasicInput
          v-model="registrationForm.name"
          label="Mobiltelefonnummer"
          placeholder="Mobiltelefonnummer eingeben"
        />
      </div>
      <hr class="my-5" />
      <div class="font-medium mb-5">Erziehungsberechtigte Person</div>
      <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
        <BasicInput
          v-model="registrationForm.name"
          label="Vorname"
          placeholder="Vorname eingeben"
        />
        <BasicInput
          v-model="registrationForm.name"
          label="Nachname"
          placeholder="Nachname eingeben"
        />
        <BasicInput
          v-model="registrationForm.name"
          label="Mobiltelefonnummer"
          placeholder="Mobiltelefonnummer eingeben"
        />
        <div />
        <BasicCheckbox
          v-model="registrationForm.boolean1"
          label="Ist ein Notfallkontakt"
        />
      </div>
      <hr class="my-5" />
      <div class="font-medium mb-5">Notfallkontakte</div>
      <Button color="secondary"><PlusSmallIcon class="h-5 mr-2" />Notfallkontakt hinzufügen</Button>
      <hr class="my-5" />
      <div class="flex items-start mb-5 space-x-3">
        <BasicCheckbox
          v-model="registrationForm.boolean1"
          class="mt-1"
        />
        <div class="font-medium">Ich habe die allgemeinen Teilnahmebedingungen gelesen und akzeptiere diese.</div>
      </div>
      <div class="flex items-start mb-10 space-x-3">
        <BasicCheckbox
          v-model="registrationForm.boolean1"
          class="mt-1"
        />
        <div class="font-medium">Ich habe die Datenschutzerklärung gelesen und akzeptiere diese.</div>
      </div>
      <Button
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
