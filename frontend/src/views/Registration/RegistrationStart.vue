<script setup lang="ts">
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import { useCreateRegistrationState } from '@/store/registrationStore'
import { useRouter } from 'vue-router'
import RegistrationLayout from './components/RegistrationLayout.vue'

const router = useRouter()
const { user } = useCreateRegistrationState()
</script>

<template>
  <RegistrationLayout @back="router.replace({ name: 'Login' })">
    <BasicInput
      v-model="user.givenName"
      placeholder="Vorname"
      class="mt-4"
    />
    <BasicInput
      v-model="user.familyName"
      placeholder="Nachname"
      class="mt-4"
    />
    <div class="btn btn-secondary mt-4 flex w-full text-left">
      <i
        class="mx-2 my-1 text-gray-400"
        size="lg"
      ></i>
      <div class="text-sm">
        Geburtsdatum
        <p class="font-semibold">07.03.2000</p>
      </div>
    </div>
    <button
      type="button"
      class="btn btn-primary absolute bottom-10 right-7 px-12"
      @click="router.push({ name: 'RegisterLogin' })"
    >
      Weiter
    </button>
  </RegistrationLayout>
</template>
