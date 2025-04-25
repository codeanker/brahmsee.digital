<script setup lang="ts">
import { UserGroupIcon, ChevronLeftIcon, UserIcon } from '@heroicons/vue/24/outline'
import ButtonCard from '@/components/UIComponents/ButtonCard.vue'
import { useAssets } from '@/composables/useAssets'

const { logo } = useAssets()
</script>

<template>
  <div class="h-svh flex flex-col items-center w-full p-6 lg:p-0">
    <div class="flex h-full flex-col lg:justify-center w-full lg:max-w-xl space-y-12">
      <div class="flex">
        <RouterLink
          :to="{ name: 'Login' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600 space-x-1"
        >
          <ChevronLeftIcon class="h-5 w-5" />
          <span>Zurück</span>
        </RouterLink>
      </div>

      <!-- Title Header -->
      <div class="flex flex-col items-center justify-center relative space-y-4">
        <img
          :src="logo"
          alt="Brahmsee Logo"
          class="size-28"
        />
        <h2 class="text-center text-4xl text-primary-700">Registrierung</h2>
        <p class="text-center">Wie möchtest Du dich registrieren?</p>
      </div>

      <div class="space-y-4">
        <ButtonCard
          to="TeilnehmerRegistrierung"
          :icon="UserIcon"
          title="Teilnehmer"
          description="Eigene Daten und Anmeldungen verwalten."
        />
        <ButtonCard
          to="GliederungRegistrierung"
          :icon="UserGroupIcon"
          title="Gliederung"
          description="Erstellen, Versenden und Verwalten von Ausschreibungen."
        />
      </div>
    </div>
  </div>
</template>
