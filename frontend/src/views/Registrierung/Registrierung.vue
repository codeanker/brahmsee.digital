<script setup lang="ts">
import { HandRaisedIcon, UserGroupIcon } from '@heroicons/vue/24/outline'

import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full grow">
    <!-- Header -->
    <PublicHeader />
    <div class="h-full grow">
      <div class="my-10">
        <div class="text-3xl font-medium">Registrierung</div>
        <div class="mb-5">Wofür möchtest Du dich registrieren?</div>
      </div>
      <!-- Form -->
      <div class="space-y-5">
        <RouterLink
          :to="{ name: 'CrewRegistrierung' }"
          class="w-full p-5 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-600"
        >
          <div class="mr-4"><HandRaisedIcon class="h-8 w-8"></HandRaisedIcon></div>
          <div class="">
            <div class="font-medium text-lg">CREW-Mitglied</div>
            <div>Registriere dich als CREW-Mitglied für unsere Veranstaltungen.</div>
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'GliederungRegistrierung' }"
          class="w-full p-5 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-600"
        >
          <div class="mr-4"><UserGroupIcon class="h-8 w-8"></UserGroupIcon></div>
          <div class="">
            <div class="font-medium text-lg">Gliederung</div>
            <div>Erstelle Ausschreibungen und versende diese zur Anmeldung und verwalte diese.</div>
          </div>
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-col">
      <PublicFooter />
    </div>
  </div>
</template>
