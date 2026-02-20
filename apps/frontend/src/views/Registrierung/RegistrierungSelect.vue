<script setup lang="ts">
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue';
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue';
import ButtonCard from '@/components/UIComponents/ButtonCard.vue';
import { useAssets } from '@/composables/useAssets';
import { ChevronLeftIcon, UserGroupIcon, UserIcon } from '@heroicons/vue/24/outline'

const { logo } = useAssets()
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full grow">
    <PublicHeader />

    <div class="grow">
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
      <div class="flex flex-col items-center justify-center relative space-y-4 mb-16">
        <img
          :src="logo"
          alt="Brahmsee Logo"
          class="size-28"
        />
        <h2 class="text-center text-4xl text-primary-700">Registrierung</h2>
        <p class="text-center">
          Wie möchtest du dich registrieren?
        </p>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <ButtonCard
          to="RegistrierungTeilnehmer"
          :icon="UserIcon"
          title="Teilnehmer"
          description="Eigene Daten und Anmeldungen verwalten."
        />
        <ButtonCard
          to="RegistrierungGliederung"
          :icon="UserGroupIcon"
          title="Gliederung"
          description="Erstellen, Versenden und Verwalten von Ausschreibungen."
        />
      </div>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
