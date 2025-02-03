<script setup lang="ts">
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { formatDate } from '@vueuse/core'
import { useRouter } from 'vue-router'
import AnmeldungFormGeneral from './AnmeldungFormGeneral.vue'

const router = useRouter()
const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
    <div class="mx-auto mb-16 max-w-2xl sm:text-center">
      <h2 class="text-base/7 font-semibold text-indigo-600">{{ unterveranstaltung?.veranstaltung?.name }}</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
        Melde dich jetzt an
      </p>

      <p class="mt-6 text-lg/8 text-gray-600">
        Du kannst
        <span v-if="unterveranstaltung?.meldeschluss"
          >Dich bis zum {{ formatDate(unterveranstaltung?.meldeschluss, 'DD.MM.YYYY') }}</span
        >
        hier anmelden. Du erhältst im Anschluss eine Anmeldebestätigung per E-Mail.
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

    <AnmeldungFormGeneral :is-public="true" />
  </div>
</template>
