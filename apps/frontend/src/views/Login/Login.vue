<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { ErrorMessage, Field, ValidateForm } from '@codeanker/validation'
import { useMutation } from '@tanstack/vue-query'
import z from 'zod'
import { apiClient } from '@/api'

const router = useRouter()
const route = useRoute()

const formSchema = z.strictObject({
  email: z.string().email(),
  password: z.string().min(1),
})

const login = useMutation({
  mutationKey: ['login'],
  mutationFn: async ({ email, password }: z.infer<typeof formSchema>) => {
    const { accessToken, account } = await apiClient.authentication.login.mutate({ email, password })

    loggedInAccount.value = account
    localStorage.setItem('jwt', accessToken)
  },
  onSuccess: () => {
    if (route.query.redirect) {
      return router.push(route.query.redirect as string)
    } else {
      const letzteVeranstaltung = localStorage.getItem('letzteVeranstaltung')
      if (letzteVeranstaltung)
        return router.push({ name: 'Dashboard', params: { veranstaltungId: letzteVeranstaltung } })
      else return router.push({ name: 'Auschreibungen' })
    }
  },
})

const hashError = ref<string>()

// read "jwt" from url hashbang
if (location.hash) {
  const hash = location.hash.slice(1)
  const params = new URLSearchParams(hash)

  location.hash = ''

  if (params.has('error')) {
    hashError.value = params.get('error') ?? undefined
  } else if (params.has('jwt')) {
    const jwt = params.get('jwt') as string
    localStorage.setItem('jwt', jwt)
  }
}

const formatLoginError = computed(() => {
  return login.isError.value ? login.error.value?.message.replace('TRPCClientError: ', '') : ''
})

const version = `${import.meta.env.VITE_APP_VERSION || 'unknown'}-${import.meta.env.VITE_APP_COMMIT_HASH || 'unknown'}`

const origin = `${location.href}/api`
const oauthHref = `/api/connect/dlrg?mode=login&origin=${encodeURIComponent(origin)}`
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="grid grid-cols-3">
      <div />

      <div>
        <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 dark:text-primary-600">
          brahmsee.digital
        </h2>
        <p class="text-center">Melde dich zu deinem Konto an</p>
      </div>

      <div class="justify-self-end pt-2">
        <DarkModeSwitch />
      </div>
    </div>

    <div class="mt-5 lg:mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        v-if="login.isError.value"
        class="bg-danger-100 text-danger-600 mb-10 rounded p-2 text-center"
      >
        {{ formatLoginError }}
      </div>
      <div class="px-6 py-12 sm:rounded-lg sm:px-12">
        <ValidateForm
          class="space-y-8"
          :schema="formSchema"
          @submit="login.mutateAsync"
        >
          <Field
            name="email"
            type="email"
            placeholder="E-Mail Adresse"
          />
          <ErrorMessage
            name="email"
            class="text-red-500 text-sm mt-1"
          />

          <Field
            name="password"
            type="password"
            placeholder="********"
          />
          <ErrorMessage
            name="password"
            class="text-red-500 text-sm mt-1"
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
            :disabled="login.isPending.value"
            full
          >
            <template v-if="login.isPending.value">
              <Loading color="white" />
            </template>
            <template v-else> Anmelden </template>
          </Button>
        </ValidateForm>

        <div>
          <div class="relative mt-5 lg:mt-10">
            <div
              class="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div class="w-full border-t border-gray-200 dark:border-gray-800" />
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span class="bg-white dark:bg-dark-primary px-6">oder anmelden mit</span>
            </div>
          </div>

          <div class="mt-6">
            <a
              :href="oauthHref"
              class="flex w-full items-center justify-center gap-3 rounded-md bg-[#e30613] px-3 py-2 text-sm font-semibold hover:bg-[#CA0511] focus-visible:ring-transparent"
            >
              <svg
                class="h-5"
                aria-hidden="true"
                viewBox="0 0 286.300 50"
              >
                <rect
                  id="Hintergrund"
                  height="50"
                  fill="transparent"
                  width="286.300"
                />
                <g id="Wortmarke">
                  <path
                    id="D"
                    d="M37,22.27v5.4c0,.89.13,3.14-1.28,3.74-1.81.76-3.13.51-5,.54H24.54V18h6.24c1.83,0,3.14-.22,4.95.55C37.14,19.13,37,21.38,37,22.27Zm.7,17.65c3.78,0,7.91.32,10.62-1s3.21-4.78,3.21-6.58V17.67c0-1.81-.48-5.27-3.21-6.58s-6.83-1-10.62-1H10V39.93H37.71"
                    fill-rule="evenodd"
                    fill="#ffed00"
                  />
                  <path
                    id="L"
                    d="M59.76,39.93V10.05H74.31V32h19v8H59.76"
                    fill="#ffed00"
                  />
                  <path
                    id="R"
                    d="M114.39,15.33h6.29c2,0,3.52-.16,4.88.47A2.48,2.48,0,0,1,127,18.59a2.58,2.58,0,0,1-1.43,2.82c-1.45.63-2.5.46-4.88.46h-6.29V15.33ZM99.84,39.93V10.05h27.49c3.17,0,6.76-.26,9.34.94,2.92,1.37,4.51,2.94,4.51,6.22l0,.8c0,2.56-1.07,3.89-3.21,5.26s-4.71,1.57-9.69,1.57h6a11,11,0,0,1,4.87,1,4.11,4.11,0,0,1,2.07,3.32V39.93H126.62V30.47c0-.91.07-2.39-1.22-2.8s-2.29-.31-4.54-.36h-6.47V39.93H99.84"
                    fill-rule="evenodd"
                    fill="#ffed00"
                  />
                  <path
                    id="G"
                    d="M169.14,21.87h20.77V33.29a6.33,6.33,0,0,1-4.49,6c-3,.84-6,.65-9.34.65H162.2c-4.6.06-8.52.4-10.9-1.25a6.51,6.51,0,0,1-2.93-5.39V16.69c0-2.31,1.27-4,3-5.37,2.06-1.7,6.34-1.27,10.87-1.27h13.88c5.47,0,9.08,0,11.1,1.45C190.26,13.7,190,18,190,18H176.05c-.44-2.16-1.67-2.72-4.49-2.72H167.1c-3.06,0-4.2,1-4.18,2.82V31.36c0,1.59.23,2.29,1.47,2.89,1,.49,2.63.41,4.53.41h3.53c3.34,0,3.63-1.82,3.63-3.81V27.31h-6.94V21.87"
                    fill="#ffed00"
                  />
                </g>
                <rect
                  id="Trenner"
                  x="200"
                  y="5"
                  width="1.82"
                  height="40"
                  fill="#ffed00"
                />
                <path
                  fill="#ffed00"
                  d="M214.22,11l6.2,0l0,29l-6.2,0l0-29z M230.66,30.76q0,2.04,0.56,3.1t1.62,1.72t3.32,0.66t3.74-1.1t1.48-2.9t-1.36-2.6q-1-0.6-3.88-1.28q-5.72-1.36-8.3-3.26t-2.58-5.66t2.88-6.3t8.56-2.54q2.72,0,4.28,0.52q6.08,2.12,6.08,8.24l-5.96,0q-0.2-1.68-0.72-2.52q-1.16-1.88-3.64-1.88t-3.78,1.06t-1.3,2.88t1.6,2.7q0.76,0.44,1.94,0.76t2.9,0.74t3.48,0.98q6.28,1.88,6.28,7.2q0,4.04-3.26,6.72t-8.6,2.68t-8.26-1.96q-2.08-1.4-2.96-4.16q-0.44-1.44-0.44-3.8l6.32,0z M268.66,20.52q-0.2-1.84-0.76-2.8q-1.28-2.28-3.92-2.28q-3.32,0-4.92,3.02t-1.6,7.74q0,7.2,3.52,9.32q1,0.6,2.24,0.6q2.4,0,3.9-1.38t1.58-4.1l6.52,0q-0.12,1.96-0.44,3q-0.64,2.28-2.16,3.8q-3.24,3.24-8.44,3.24q-6.92,0-10.32-4.6q-2.88-3.8-2.88-10.32t3.58-10.68t9.66-4.16q4.76,0,7.72,2.68q3.04,2.64,3.04,6.92l-6.32,0z"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <p class="mt-5 lg:mt-10 text-center text-sm">
        Noch kein Konto?
        <RouterLink
          :to="{ name: 'Registrierung' }"
          class="font-semibold leading-6 text-primary-600 hover:text-primary-500"
        >
          Registriere dich jetzt
        </RouterLink>
      </p>
      <p class="flex items-center justify-center mt-20 text-center text-xs">
        {{ version }}
        <span class="mx-1">-</span>
        <a
          href="https://codeanker.de?utm_source=brahmsee.digital"
          target="_blank"
          rel="noopener noreferrer"
          class="font-medium leading-6 hover:text-primary-500"
          >Supported by CODEANKER</a
        >
      </p>
    </div>
  </div>
</template>
