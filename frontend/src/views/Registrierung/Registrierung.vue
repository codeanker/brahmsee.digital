<script setup lang="ts">
import { HandRaisedIcon, UserGroupIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
        Registrierung
      </h2>
      <p class="text-center">Wofür möchtest Du dich registrieren?</p>
      <div class="mt-5 lg:mt-10 space-y-5">
        <RouterLink
          :to="{ name: 'CrewRegistrierung' }"
          class="w-full p-5 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-600 group"
        >
          <div class="mr-4">
            <HandRaisedIcon class="h-8 w-8 transition-all ease-in-out group-hover:text-primary-600" />
          </div>
          <div class="">
            <div class="font-medium text-lg transition-all ease-in-out group-hover:text-primary-600">CREW-Mitglied</div>
            <div>Registriere dich als CREW-Mitglied für unsere Veranstaltungen.</div>
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'GliederungRegistrierung' }"
          class="w-full p-5 rounded-lg flex cursor-pointer transition-all ease-in-out border border-gray-200 hover:border-primary-600 group"
        >
          <div class="mr-4">
            <UserGroupIcon class="h-8 w-8 transition-all ease-in-out group-hover:text-primary-600" />
          </div>
          <div class="">
            <div class="font-medium text-lg transition-all ease-in-out group-hover:text-primary-600">Gliederung</div>
            <div>Erstelle Ausschreibungen und versende diese zur Anmeldung und verwalte diese.</div>
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'Login' }"
          class="flex justify-center text-sm transition-all text-gray-600 hover:text-primary-600"
        >
          zurück
        </RouterLink>
      </div>
    </div>
  </div>
</template>
