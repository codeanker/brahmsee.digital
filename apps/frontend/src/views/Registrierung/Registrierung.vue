<script setup lang="ts">
import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import type { IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import Stammdaten from '@/components/forms/anmeldung/Stammdaten.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'
import { useAssets } from '@/composables/useAssets'
import { ValidateForm } from '@codeanker/validation'
import { ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { useMutation } from '@tanstack/vue-query'
import { ref } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps<{
  mode: 'teilnehmer' | 'gliederung'
}>()

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

const gliederungForm = ref<{ id: string | null }>({ id: null })

async function queryObjectGliederungen(searchTerm: string) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}

const { mutate, error, isSuccess, isError } = useMutation({
  mutationKey: ['register', props.mode],
  mutationFn: async () => {
    if (props.mode === "teilnehmer") {
      await apiClient.account.teilnehmerCreate.mutate({
        firstname: stammdatenForm.value.firstname,
        lastname: stammdatenForm.value.lastname,
        gender: stammdatenForm.value.gender,
        birthday: stammdatenForm.value.birthday ?? new Date(),
        email: registrationForm.value.email,
        password: registrationForm.value.password,
      })
    } else if (props.mode === "gliederung") {
      await apiClient.account.gliederungCreate.mutate({
        firstname: stammdatenForm.value.firstname,
        lastname: stammdatenForm.value.lastname,
        gender: stammdatenForm.value.gender,
        birthday: stammdatenForm.value.birthday ?? new Date(),
        email: registrationForm.value.email,
        password: registrationForm.value.password,
        gliederungId: gliederungForm.value.id as string,
      })
    }
  },
  onError: (e) => {
    toast.error(e.message, {
      duration: 5000,
    })
  }
})
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full grow">
    <!-- Header -->
    <PublicHeader />

    <div class="grow">
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
      <div class="flex flex-col items-center justify-center relative space-y-4 mb-16">
        <img
          :src="logo"
          alt="Brahmsee Logo"
          class="size-28"
        />
        <h2
          v-if="mode === 'teilnehmer'"
          class="text-center text-4xl text-primary-700"
        >
          Registrierung
        </h2>
        <h2
          v-if="mode === 'gliederung'"
          class="text-center text-4xl text-primary-700"
        >
          Registrierung als Gliederung
        </h2>
        <p class="text-center">Registriere dich mit deiner E-Mail Adresse und einem Passwort</p>
      </div>

      <ValidateForm
        v-if="!isSuccess"
        class="space-y-4"
        @submit="mutate"
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

        <template v-if="mode === 'gliederung'">
          <BasicTypeahead
            v-model="gliederungForm"
            :query="queryObjectGliederungen"
            :input-formatter="(result) => result?.name"
            :result-formatter="(result) => result.name"
            :strict="true"
            label="Gliederung"
            required
            placeholder="Gliederung eingeben"
          />
          <hr class="my-5" />
        </template>

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

      <div
        v-if="isError === true"
        class="bg-danger-100 text-danger-600 rounded p-2 text-center"
      >
        {{ error }}
      </div>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
