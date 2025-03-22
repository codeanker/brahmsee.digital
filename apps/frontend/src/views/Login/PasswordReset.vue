<script setup lang="ts">
import { CheckCircleIcon, ChevronLeftIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { ValidateForm } from '@codeanker/validation'

const email = ref('')
const password = ref('')
const route = useRoute()

const lastAction = ref('')

const requestPasswordReset = (action) => {
  lastAction.value = action
  performReset()
}

const {
  state: resetPassword,
  execute: performReset,
  isLoading: isLoading,
} = useAsyncState(
  async () => {
    let data
    if (route.params.token) data = { passwordResetToken: route.params.token, password: password.value }
    else data = { email: email.value }

    return await apiClient.account.resetPassword.mutate({
      ...data,
    })
  },
  null,
  { immediate: false }
)

const showReset = computed(() => {
  return !route.params.token && !resetPassword.value?.status
})

const showSet = computed(() => {
  return route.params.token && !resetPassword.value?.status
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
      <div class="flex flex-col items-center justify-center relative">
        <h2 class="text-center text-4xl text-primary-700">Passwort vergessen</h2>
        <p class="text-center">Nicht schlimm, hier kannst Du es zurücksetzen</p>
      </div>

      <!-- Reset Password Form -->
      <template v-if="showReset">
        <ValidateForm
          class="space-y-8"
          @submit="requestPasswordReset('request')"
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
            :disabled="isLoading"
            full
          >
            <template v-if="isLoading">
              <Loading color="white" />
            </template>
            <template v-else> Zurücksetzen </template>
          </Button>
        </ValidateForm>
      </template>
      <template v-if="showSet">
        <ValidateForm
          class="space-y-8"
          @submit="requestPasswordReset('reset')"
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
            :disabled="isLoading"
            full
          >
            <template v-if="isLoading">
              <Loading color="white" />
            </template>
            <template v-else> Zurücksetzen abschließen </template>
          </Button>
        </ValidateForm>
      </template>

      <!-- Success Message -->
      <template v-if="!showReset && !showSet">
        <div class="flex flex-col text-center items-center justify-center">
          <CheckCircleIcon class="h-10 mb-2 text-primary-600" />
          <div>
            <span v-if="lastAction == 'request'">
              Wir haben Dir einen Link zum Zurücksetzen an deine E-Mail gesendet.</span
            >
            <span v-if="lastAction == 'reset'"> Wir haben dein Passwort geändert.</span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
