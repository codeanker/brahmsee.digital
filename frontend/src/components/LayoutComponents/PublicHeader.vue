<script setup lang="ts">
import GliederungLogo from '@/components/UIComponents/GliederungLogo.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { RouterLink } from 'vue-router'

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
          <GliederungLogo :name="unterveranstaltung?.gliederung?.name ?? ''" />
        </a>
      </div>
      <div class="lg:flex lg:flex-1 lg:justify-end">
        <RouterLink
          class="cursor-pointer text-gray-900 hover:underline"
          :to="{ name: 'Login', query: { redirect: '/ausschreibung/' + unterveranstaltung?.id } }"
        >
          Anmelden <span aria-hidden="true">&rarr;</span>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>
