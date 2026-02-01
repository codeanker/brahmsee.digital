<script setup lang="ts">
import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import type { IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import Stammdaten from '@/components/forms/anmeldung/Stammdaten.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import { useAssets } from '@/composables/useAssets'
import { ValidateForm } from '@codeanker/validation'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const { logo } = useAssets()

interface IRegistrationForm {
  dataprivacy: boolean
  email: string
  password: string
}

const registrationForm = ref<IRegistrationForm>({
  email: '',
  password: '',
  dataprivacy: false,
})

const stammdatenForm = ref<IStammdaten>({
  firstname: '',
  lastname: '',
  gender: 'MALE',
  birthday: null,
})

const isSuccess = ref(false)

async function register() {
  try {
    await apiClient.account.teilnehmerCreate.mutate({
      firstname: stammdatenForm.value.firstname,
      lastname: stammdatenForm.value.lastname,
      gender: stammdatenForm.value.gender,
      birthday: stammdatenForm.value.birthday ?? new Date(),
      email: registrationForm.value.email,
      password: registrationForm.value.password,
    })
    isSuccess.value = true
  } catch (e) {
    console.error(e)
    if (e instanceof Error) {
      toast.error(e.message, {
        duration: 5000,
      })
    } else {
      toast.error('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.', {
        duration: 5000,
      })
    }
  }
}
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full grow">
    <!-- Header -->
    <PublicHeader />

    <div class="grow">
      <div class="flex">
        <RouterLink
          :to="{ name: 'Login' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600 space-x-1"
        >
          <ChevronLeftIcon class="h-5 w-5" />
          <span>Zurück</span>
        </RouterLink>
      </div>

      <!-- Title Header -->
      <div class="flex flex-col items-center justify-center relative space-y-4">
        <img
          :src="logo"
          alt="Brahmsee Logo"
          class="size-28"
        />
        <h2 class="text-center text-4xl text-primary-700">Registrierung</h2>
        <p class="text-center">Registriere dich mit deiner E-Mail Adresse und einem Passwort</p>
      </div>

      <ValidateForm
        v-if="!isSuccess"
        class="space-y-4"
        @submit="register"
      >
        <Stammdaten v-model="stammdatenForm" />
        <hr class="my-5" />
        <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
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
        class="space-y-4 text-center text-primary-600 font-bold"
      >
        <p>Die Registrierung war erfolgreich.</p>
        <p>
          Bitte prüfe dein E-Mail Postfach und bestätige deinen Account. Ohne Aktivierung kannst du den Account nicht
          verwenden.
        </p>
      </div>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
