<script setup lang="ts">
import { apiClient } from '@/api'
import DarkModeSwitch from '@/components/DarkModeSwitch.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { useAssets } from '@/composables/useAssets'
import type { RouterInput } from '@codeanker/api'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRouteParams } from '@vueuse/router'
import { RouterLink } from 'vue-router'

const version = `${import.meta.env.VITE_APP_VERSION || 'unknown'}-${import.meta.env.VITE_APP_COMMIT_HASH || 'unknown'}`

const { logo, appname } = useAssets()

const token = useRouteParams<string>('token')

const { data, error, isError } = useQuery({
  queryKey: ['requestGliederungAccessValidate', token.value],
  queryFn: () => {
    if (!token.value) {
      return false
    }

    return apiClient.access.requestGliederungAccessValidate.query({ token: token.value })
  },
})

const {
  mutateAsync,
  data: decision,
  error: decideError,
  isError: decideIsError,
  isSuccess: decideIsSuccess,
  isPending: decideIsPending,
} = useMutation({
  mutationKey: ['requestGliederungAdminConfirm'],
  mutationFn: (input: RouterInput['access']['requestGliederungAdminConfirm']) =>
    apiClient.access.requestGliederungAdminConfirm.mutate(input),
})

async function doDecide(decision: boolean) {
  if (!data.value) {
    return
  }

  await mutateAsync({
    token: token.value,
    decision,
  })
}
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
        <div class="absolute right-0 top-0">
          <DarkModeSwitch />
        </div>
      </div>

      <div
        v-if="isError === true"
        class="bg-danger-100 text-danger-600 rounded p-2 text-center"
      >
        {{ error }}
      </div>
      <div
        v-if="decideIsError === true"
        class="bg-danger-100 text-danger-600 rounded p-2 text-center"
      >
        {{ decideError }}
      </div>

      <div
        v-if="data === false"
        class="bg-danger-100 text-danger-600 rounded p-2 text-center"
      >
        Der Link ist leider ungültig.
      </div>
      <div
        v-else-if="!decideIsSuccess"
        class="flex flex-col items-center text-center gap-y-8"
      >
        <p>
          <span class="text-yellow-600 font-medium"
            >{{ data?.account.person.firstname }} {{ data?.account.person.lastname }}</span
          >
          hat eine Anfrage gestellt, für die Gliederung
          <span class="text-yellow-600 font-medium">{{ data?.gliederung.name }}</span>
          als Verantwortlicher zu agieren.
        </p>

        <p>Diese Berechtigung umfasst folgende Befugnisse:</p>

        <ol class="list-decimal list-inside space-y-2">
          <li>Anlegen und Verwalten von Ausschreibungen</li>
          <li>Einsichtnahme und Verwaltung von Daten der eigenen Teilnehmenden verfügbarer Veranstaltungen</li>
        </ol>

        <p>
          Wir empfehlen,
          <span class="text-yellow-600 font-medium"
            >{{ data?.account.person.firstname }} {{ data?.account.person.lastname }}</span
          >
          über die datenschutzrechtlichen Pflichten zu belehren, welche mit den genannten Befugnissen einhergehen.
        </p>

        <hr class="w-full border-t border-gray-600" />

        <p>
          Bitte entscheide im Folgenden über die Anfrage von
          <span class="text-yellow-600 font-medium"
            >{{ data?.account.person.firstname }} {{ data?.account.person.lastname }}</span
          >:
        </p>

        <div class="grid grid-cols-2 gap-x-4">
          <Button
            color="primary"
            @click="() => doDecide(true)"
            >Bestätigen</Button
          >
          <Button
            color="danger"
            @click="() => doDecide(false)"
            >Ablehnen</Button
          >
        </div>

        <div v-if="decideIsPending">
          <Loading />
        </div>
      </div>
      <div
        v-else
        class="text-center"
      >
        <p v-if="decision">Die Anfrage wurde <span class="text-primary-600 font-bold">bestätigt</span>.</p>
        <p v-else>Die Anfrage wurde <span class="text-danger-600">abgelehnt</span>.</p>
      </div>

      <hr class="w-full border-t border-gray-600" />

      <p class="text-center text-sm dark:text-gray-200">
        Noch kein Konto?
        <RouterLink
          :to="{ name: 'Registrierung' }"
          class="font-semibold text-primary-600 hover:text-primary-500"
        >
          Registriere dich jetzt
        </RouterLink>
      </p>
      <p class="flex items-center justify-center text-center text-xs darl:text-gray-200">
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
