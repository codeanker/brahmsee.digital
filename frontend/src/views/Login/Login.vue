<script setup>
import { ref } from 'vue'
import useAuthentication from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'
import Button from '@/components/Button.vue'

const router = useRouter()

const email = ref('')
const password = ref('')

const { loginPending, login, loginError } = useAuthentication()

async function loginWithRecirect() {
  const response = await login({ email: email.value, password: password.value })
  if (response) router.push({ name: 'Dashboard' })
}

const version = `${import.meta.env.VITE_APP_VERSION || '0.0.0'}-${import.meta.env.VITE_APP_COMMIT_HASH || 'local'}`
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
        <input
          v-model="email"
          type="email"
          class="w-full"
          placeholder="E-Mail"
        />
        <input
          v-model="password"
          type="password"
          class="w-full"
          placeholder="Password"
        />
        <Button
          type="submit"
          :disabled="loginPending"
          full
        >
          <template v-if="loginPending">
            <i class="fa-sharp fa-light fa-spinner-third fa-2xl"></i>
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
