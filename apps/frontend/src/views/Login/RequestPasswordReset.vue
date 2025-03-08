<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { ErrorMessage, Field, ValidateForm } from '@codeanker/validation'
import { useMutation } from '@tanstack/vue-query'
import { z } from 'zod'

const formSchema = z.strictObject({
  email: z.string().email(),
})

const sendResetPasswordRequest = useMutation({
  mutationKey: ['password-reset-request'],
  mutationFn: async (values: z.infer<typeof formSchema>) => {
    return await apiClient.account.resetPassword.mutate({
      type: 'request',
      email: values.email,
    })
  },
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-4xl leading-9 tracking-tight text-primary-700">Passwort vergessen</h2>
      <p class="text-center">Nicht schlimm, hier kannst Du es zurücksetzen</p>
    </div>

    <div class="mt-5 lg:mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 sm:rounded-lg sm:px-12">
        <ValidateForm
          class="space-y-8"
          :schema="formSchema"
          @submit="sendResetPasswordRequest.mutate"
        >
          <Field
            name="email"
            type="email"
            class="w-full"
            placeholder="E-Mail"
            :disabled="sendResetPasswordRequest.isPending.value || sendResetPasswordRequest.isSuccess.value"
            required
          />
          <ErrorMessage
            name="email"
            class="text-red-500 text-sm"
          />

          <Button
            color="primary"
            type="submit"
            :disabled="sendResetPasswordRequest.isPending.value || sendResetPasswordRequest.isSuccess.value"
            full
          >
            <template v-if="sendResetPasswordRequest.isPending.value">
              <Loading color="white" />
            </template>
            <template v-else> Anfrage senden </template>
          </Button>
        </ValidateForm>
      </div>

      <template v-if="sendResetPasswordRequest.isSuccess.value">
        <div class="flex flex-col text-center items-center justify-center mb-12">
          <CheckCircleIcon class="h-10 mb-2 text-primary-600" />
          <div>
            <span> Wir haben Dir einen Link zum Zurücksetzen an deine E-Mail gesendet. </span>
          </div>
        </div>
      </template>

      <RouterLink
        :to="{ name: 'Login' }"
        class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600"
      >
        Zurück zum Login
      </RouterLink>
    </div>
  </div>
</template>
