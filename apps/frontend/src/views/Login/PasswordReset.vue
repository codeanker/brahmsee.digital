<script setup lang="ts">
import { CheckCircleIcon, ChevronLeftIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { useAssets } from '@/composables/useAssets'
import { ValidateForm } from '@codeanker/validation'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRouteParams } from '@vueuse/router'

const password = ref('')
const token = useRouteParams<string>('token')

const { logo } = useAssets()

const { data: isValid, isFetching } = useQuery({
  queryKey: ['validatePasswordResetToken', token],
  queryFn: () => apiClient.account.validatePasswordResetToken.query({ token: token.value }),
  shallow: true,
})

const { mutate, error, isSuccess, isPending, isError } = useMutation({
  mutationKey: ['resetPassword'],
  mutationFn: () =>
    apiClient.account.resetPassword.mutate({
      token: token.value,
      password: password.value,
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

      <template v-if="!isSuccess">
        <div
          v-if="isFetching"
          class="flex flex-col gap-y-2 items-center"
        >
          <Loading color="white" />
          <span> Wird geladen </span>
        </div>
        <ValidateForm
          v-else-if="isValid"
          class="space-y-8"
          @submit="mutate"
        >
          <BasicPassword
            id="password"
            v-model="password"
            class="w-full"
            placeholder="Passwort"
            label="Passwort"
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
            <template v-else> Zurücksetzen abschließen </template>
          </Button>
        </ValidateForm>

        <div
          v-else
          class="text-center flex flex-col items-center gap-y-2"
        >
          <p class="text-red-500 font-bold text-lg">Der Token ist leider ungültig.</p>
          <p>
            Wenn du glaubst, dass es sich dabei um einen Fehler handelt, kannst du einfach einen neuen Link anfordern.
          </p>
          <Button :to="{ name: 'PasswortReset' }"> Neuen Link anfordern </Button>
        </div>
      </template>

      <template v-if="isSuccess">
        <div class="flex flex-col text-center items-center justify-center">
          <CheckCircleIcon class="h-10 mb-2 text-primary-600" />
          <span> Wir haben dein Passwort geändert. </span>
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
