<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
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
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-4xl leading-9 tracking-tight text-primary-700">Passwort vergessen</h2>
      <p class="text-center">Nicht schlimm, hier kannst Du es zurücksetzen</p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div v-if="showReset">
        <div class="bg-white px-6 py-12 sm:rounded-lg sm:px-12">
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
            ></BasicInput>
            <Button
              color="primary"
              type="submit"
              :disabled="isLoading"
              full
            >
              <template v-if="isLoading">
                <Loading color="white"></Loading>
              </template>
              <template v-else> zurücksetzen </template>
            </Button>
          </ValidateForm>
        </div>
        <RouterLink
          :to="{ name: 'Login' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600"
        >
          zurück
        </RouterLink>
      </div>

      <div v-if="showSet">
        <div class="bg-white px-6 py-12 sm:rounded-lg sm:px-12">
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
            ></BasicPassword>
            <Button
              color="primary"
              type="submit"
              :disabled="isLoading"
              full
            >
              <template v-if="isLoading">
                <Loading color="white"></Loading>
              </template>
              <template v-else> zurücksetzen </template>
            </Button>
          </ValidateForm>
        </div>
        <RouterLink
          :to="{ name: 'Login' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600"
        >
          zurück
        </RouterLink>
      </div>

      <div v-if="!showReset && !showSet">
        <div class="flex flex-col text-center items-center justify-center">
          <CheckCircleIcon class="h-10 mb-2 text-primary-600"></CheckCircleIcon>
          <div>
            <span v-if="lastAction == 'request'">
              Wir haben Dir einen Link zum zurücksetzen an deine E-Mail gesendet.</span
            >
            <span v-if="lastAction == 'reset'"> Wir haben dein Passwort geändet.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
