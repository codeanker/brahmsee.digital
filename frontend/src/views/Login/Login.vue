<script setup>
import { ref } from 'vue'
import { faSpinnerThird } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import useAuthentication from '@/composables/useAuthentication'
import { useRouter } from 'vue-router'

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
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="loginPending"
        >
          <template v-if="loginPending">
            <FontAwesomeIcon
              :icon="faSpinnerThird"
              spin
              size="lg"
            />
          </template>
          <template v-else> Login </template>
        </button>
        <button
          type="button"
          class="btn btn-link text-primary-600 hidden w-full"
          @click="router.push({ name: 'RegistrationStart' })"
        >
          Registrieren
        </button>
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
