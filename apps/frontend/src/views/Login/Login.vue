<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { login, loginError, loginPending } from '@/composables/useAuthentication'
import { ValidateForm } from '@codeanker/validation'
import { useAssets } from '@/composables/useAssets'

const router = useRouter()
const route = useRoute()

const { logo, appname } = useAssets()

const email = ref('')
const password = ref('')

// read "jwt" from url hashbang
if (location.hash) {
  const hash = location.hash.substr(1)
  const hashParams = new URLSearchParams(hash)
  const jwt = hashParams.get('jwt')
  if (jwt) {
    localStorage.setItem('jwt', jwt)
    location.hash = ''
  }
  const error = hashParams.get('error')
  if (error) {
    loginError.value = new Error(error)
  }
}

async function loginWithRecirect() {
  const response = await login({ email: email.value, password: password.value })
  if (response) {
    if (route.query.redirect) {
      return router.push(route.query.redirect as string)
    } else {
      const letzteVeranstaltung = localStorage.getItem('letzteVeranstaltung')
      if (letzteVeranstaltung)
        return router.push({ name: 'Dashboard', params: { veranstaltungId: letzteVeranstaltung } })
      else return router.push({ name: 'Auschreibungen' })
    }
  }
}

const formatLoginError = computed(() => {
  return loginError.value ? loginError.value.message.replace('TRPCClientError: ', '') : ''
})

const version = `${import.meta.env.VITE_APP_VERSION || 'unknown'}-${import.meta.env.VITE_APP_COMMIT_HASH || 'unknown'}`

const origin = `${location.href}/api`
const oauthHref = `/api/connect/dlrg?mode=login&origin=${encodeURIComponent(origin)}`
</script>

<template>
  <div class="h-svh flex flex-col items-center w-full p-6 lg:p-0">
    <div class="flex h-full flex-col lg:justify-center w-full lg:max-w-xl space-y-12">
      <!-- Title Header -->
      <div class="flex flex-col items-center justify-center relative space-y-4">
        <img
          :src="logo"
          alt="Website Logo"
          class="size-28"
        />
        <h2 class="text-center text-4xl tracking-tight text-primary-700 dark:text-primary-600">{{ appname }}</h2>
        <p class="text-center">Melde dich zu deinem Konto an</p>
        <div class="absolute right-0">
          <DarkModeSwitch />
        </div>
      </div>

      <!-- Login Error -->
      <div
        v-if="loginError"
        class="bg-danger-100 text-danger-600 rounded p-2 text-center"
      >
        {{ formatLoginError }}
      </div>

      <!-- Login Form -->
      <ValidateForm
        class="space-y-8"
        @submit="loginWithRecirect"
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
        <BasicPassword
          id="password"
          v-model="password"
          class="w-full"
          placeholder="Passwort"
          label="Passwort"
          required
        />
        <div class="flex items-center justify-center">
          <div class="text-sm">
            <RouterLink
              :to="{ name: 'PasswortReset' }"
              class="font-semibold text-primary-600 hover:text-primary-500"
            >
              Passwort vergessen?
            </RouterLink>
          </div>
        </div>
        <Button
          color="primary"
          type="submit"
          :disabled="loginPending"
          full
        >
          <template v-if="loginPending">
            <Loading color="white" />
          </template>
          <template v-else> Anmelden </template>
        </Button>
        <!-- Alternative Login Methods -->
        <div class="relative">
          <div
            class="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div class="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div class="relative flex justify-center text-sm font-medium">
            <span class="bg-white dark:bg-dark-primary px-6">oder anmelden mit</span>
          </div>
        </div>

        <a
          :href="oauthHref"
          class="flex w-full items-center justify-center gap-2 rounded-md bg-[#e30613] px-3 py-2 text-sm font-semibold hover:bg-[#CA0511] focus-visible:ring-transparent"
        >
          <img
            src="@/assets/images/svg/isc.svg"
            alt="ISC Logo"
            class="h-5"
          />
        </a>
      </ValidateForm>
      <p class="text-center text-sm">
        Noch kein Konto?
        <RouterLink
          :to="{ name: 'Registrierung' }"
          class="font-semibold text-primary-600 hover:text-primary-500"
        >
          Registriere dich jetzt
        </RouterLink>
      </p>
      <p class="flex items-center justify-center text-center text-xs">
        {{ version }}
        <span class="mx-1">-</span>
        <a
          href="https://codeanker.de?utm_source=brahmsee.digital"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium hover:text-primary-500"
          >Supported by CODEANKER</a
        >
      </p>
    </div>
  </div>
</template>
