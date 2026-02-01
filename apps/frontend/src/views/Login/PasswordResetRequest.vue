<script setup lang="ts">
import { CheckCircleIcon, ChevronLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { useAssets } from '@/composables/useAssets'
import { ValidateForm } from '@codeanker/validation'
import { useMutation } from '@tanstack/vue-query'

const email = ref('')

const { logo } = useAssets()

const { mutate, error, isSuccess, isPending, isError } = useMutation({
  mutationKey: ['requestPasswordReset'],
  mutationFn: () =>
    apiClient.account.requestPasswordReset.mutate({
      email: email.value,
    }),
})
</script>

<template>
  <div class="h-svh flex flex-col items-center w-full p-6 lg:p-0">
    <div class="flex h-full flex-col lg:justify-center w-full lg:max-w-xl space-y-12">
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
      <div class="flex flex-col space-y-4 items-center justify-center relative">
        <img
          :src="logo"
          alt="Website Logo"
          class="size-28"
        />
        <h2 class="text-center text-4xl text-primary-700">Passwort vergessen</h2>
        <p class="text-center">Nicht schlimm, hier kannst Du es zurücksetzen</p>
      </div>

      <!-- Reset Password Form -->
      <ValidateForm
        class="space-y-8"
        @submit="mutate"
      >
        <BasicInput
          id="email"
          v-model="email"
          type="email"
          class="w-full"
          placeholder="E-Mail"
          label="E-Mail"
          required
        />
        <Button
          color="primary"
          type="submit"
          :disabled="isPending"
          full
        >
          <template v-if="isPending">
            <Loading color="white" />
          </template>
          <template v-else> Zurücksetzen </template>
        </Button>
      </ValidateForm>

      <template v-if="isSuccess">
        <div class="flex flex-col text-center items-center justify-center">
          <CheckCircleIcon class="h-10 mb-2 text-primary-600" />
          <span>Wir haben Dir einen Link zum Zurücksetzen an deine E-Mail gesendet.</span>
        </div>
      </template>

      <template v-if="isError">
        <div class="flex flex-col text-center items-center justify-center text-danger-600">
          <XMarkIcon class="h-10 mb-2" />
          <span> {{ error }} </span>
        </div>
      </template>
    </div>
  </div>
</template>
