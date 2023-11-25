<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { login, loginError, loginPending } from '@/composables/useAuthentication'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

async function loginWithRecirect() {
  const response = await login({ email: email.value, password: password.value })
  if (response) {
    if (route.query.redirect) {
      return router.push(route.query.redirect as string)
    } else {
      return router.push({ name: 'Dashboard' })
    }
  }
}

const version = `${import.meta.env.VITE_APP_VERSION || 'unknown'}-${import.meta.env.VITE_APP_COMMIT_HASH || 'unknown'}`
</script>

<template>
  <div class="container flex h-screen max-w-sm flex-col justify-between pt-32">
    <div>
      <div class="mb-32 flex justify-center">
        <img
          src="@/assets/images/logo.svg"
          class="w-64"
        />
      </div>
      <form
        class="space-y-2"
        @submit.prevent="loginWithRecirect"
      >
        <BasicInput
          v-model="email"
          type="email"
          class="w-full"
          placeholder="E-Mail"
          label="E-Mail"
        ></BasicInput>
        <BasicPassword
          v-model="password"
          class="w-full"
          placeholder="Passwort"
          label="Passwort"
        ></BasicPassword>
        <Button
          color="primary"
          type="submit"
          :disabled="loginPending"
          full
        >
          <template v-if="loginPending">
            <Loading color="white"></Loading>
          </template>
          <template v-else> Login </template>
        </Button>
        <Button
          color="secondary"
          full
          class="hidden"
          @click="router.push({ name: 'RegistrationStart' })"
        >
          Registrieren
        </Button>
      </form>
      <div
        v-if="loginError"
        class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
      >
        {{ loginError }}
      </div>
    </div>
    <div class="mb-2 text-center text-gray-300">
      {{ version }}
    </div>
  </div>
</template>
