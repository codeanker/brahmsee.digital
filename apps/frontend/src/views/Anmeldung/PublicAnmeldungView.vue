<script setup lang="ts">
import { apiClient } from '@/api'
import Alert from '@/components/UIComponents/Alert.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { dayjs } from '@codeanker/helpers'
import { computedAsync, formatDate } from '@vueuse/core'
import { useRouteQuery } from '@vueuse/router'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AnmeldungFormGeneral from './AnmeldungFormGeneral.vue'

const router = useRouter()
const unterveranstaltung = injectUnterveranstaltung()

const token = useRouteQuery<string>('token')

const isClosed = computed(() => dayjs().isAfter(unterveranstaltung?.value?.meldeschluss))
const isTokenValid = computedAsync(async () => {
  if (typeof token.value !== 'string') {
    return undefined
  }
  if (!unterveranstaltung.value) {
    return null
  }

  return await apiClient.anmeldungLink.authorize.query({
    unterveranstaltungId: unterveranstaltung.value.id,
    accessToken: token.value,
  })
})

const canProceed = computed(() => !isClosed.value || (isTokenValid.value ?? false))
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
    <div class="mx-auto mb-16 max-w-2xl sm:text-center">
      <h2 class="text-base/7 font-semibold text-indigo-600">{{ unterveranstaltung?.veranstaltung?.name }}</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
        Melde dich jetzt an
      </p>

      <p class="mt-6 text-lg/8 text-gray-600">
        <template v-if="canProceed">
          <template v-if="!token">
            Du kannst dich
            <span v-if="unterveranstaltung?.meldeschluss">
              bis <u>{{ formatDate(unterveranstaltung?.meldeschluss, 'dddd, [den] DD. MMMM YYYY') }}</u>
            </span>
            hier anmelden.
          </template>
          Im Anschluss erhältst du eine Bestätigung per E-Mail.
        </template>
        <template v-else>
          <Alert
            type="danger"
            title="Anmeldeschluss erreicht"
          >
            Leider ist der Anmeldeschluss schon erreicht. Eine Anmeldung ist nicht mehr möglich. Für Fragen wende dich
            bitte an deine Gliederung.
          </Alert>
        </template>
      </p>

      <div class="mt-6">
        <a
          class="cursor-pointer text-primary-600 hover:underline"
          :to="{ name: 'Public Anmeldung' }"
          @click="router.back()"
        >
          <span aria-hidden="true">&larr;</span> zurück zur Ausschreibung
        </a>
      </div>
    </div>

    <AnmeldungFormGeneral
      v-if="canProceed"
      :is-public="true"
      :token="token"
    />
  </div>
</template>
