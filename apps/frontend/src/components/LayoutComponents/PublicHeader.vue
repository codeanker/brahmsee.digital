<script setup lang="ts">
import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()
const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <header class="relative z-50">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <a
          href="#"
          class="-m-1.5 p-1.5"
        >
          <GliederungLogo :name="unterveranstaltung?.gliederung?.name ?? 'Schleswig-Holstein'" />
        </a>
      </div>
      <div class="lg:flex lg:flex-1 lg:justify-end">
        <RouterLink
          v-if="router.currentRoute.value.name === 'Public Landing'"
          class="cursor-pointer text-gray-900 hover:underline"
          :to="{ name: 'Public Anmeldung' }"
        >
          Anmelden <span aria-hidden="true">&rarr;</span>
        </RouterLink>
        <RouterLink
          v-if="
            router.currentRoute.value.name === 'Public Anmeldung' ||
            router.currentRoute.value.name === 'Public Anmeldung Result'
          "
          class="cursor-pointer text-gray-900 hover:underline"
          :to="{ name: 'Public Landing' }"
        >
          <span aria-hidden="true">&larr;</span> Ausschreibung
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
