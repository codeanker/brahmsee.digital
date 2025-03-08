<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import PasswordStrength from '@/components/PasswordStrength.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { ErrorMessage, Field, ValidateForm } from '@codeanker/validation'
import { useMutation } from '@tanstack/vue-query'
import { useTemplateRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { z } from 'zod'

const router = useRouter()
const route = useRoute()
const token = route.params.token

if (typeof token !== 'string') {
  router.replace({ name: 'Login' })
}

const form = useTemplateRef('form')
const strength = useTemplateRef('strength')

const formSchema = z.strictObject({
  password: z.string().min(1),
})

type FormSchema = z.infer<typeof formSchema>

const sendResetPasswordRequest = useMutation({
  mutationKey: ['password-reset-request'],
  mutationFn: async (values: FormSchema) => {
    return await apiClient.account.resetPassword.mutate({
      type: 'reset',
      password: values.password,
      token: token as string,
    })
  },
})
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-4xl leading-9 tracking-tight text-primary-700">Passwort zurücksetzen</h2>
      <p class="text-center">Nicht schlimm, hier kannst Du es zurücksetzen</p>
    </div>

    <div class="mt-5 lg:mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div class="bg-white px-6 py-12 sm:rounded-lg sm:px-12">
        <ValidateForm
          ref="form"
          class="space-y-8"
          :schema="formSchema"
          @submit="sendResetPasswordRequest.mutate"
        >
          <Field
            name="password"
            type="password"
            class="w-full"
            placeholder="Neues Passwort"
            :disabled="sendResetPasswordRequest.isPending.value || sendResetPasswordRequest.isSuccess.value"
            required
          />
          <ErrorMessage
            name="password"
            class="text-red-500 text-sm"
          />

          <PasswordStrength
            ref="strength"
            :password="form?.values.password"
          />

          <Button
            color="primary"
            type="submit"
            :disabled="
              !strength?.isValid || sendResetPasswordRequest.isPending.value || sendResetPasswordRequest.isSuccess.value
            "
            full
          >
            <template v-if="sendResetPasswordRequest.isPending.value">
              <Loading color="white" />
            </template>
            <template v-else>Zurücksetzen</template>
          </Button>
        </ValidateForm>
      </div>

      <template v-if="sendResetPasswordRequest.isSuccess.value">
        <div class="flex flex-col text-center items-center justify-center mb-12">
          <CheckCircleIcon class="h-10 mb-2 text-primary-600" />
          <span> Wir haben dein Passwort zurückgesetzt. Du kannst dich jetzt anmelden. </span>
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
