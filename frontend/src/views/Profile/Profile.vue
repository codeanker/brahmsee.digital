<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Dein Profil</h1>
        <p class="mt-2 text-sm text-gray-700">Ändere deine Daten und prüfe deine Zugehörigkeit.</p>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="flex flex-row items-center gap-16">
        <img
          class="h-64 w-64 rounded-full border-4 border-gray-700 bg-green-700"
          :src="userProfileImage(user, 512)"
          alt=""
        />
        <div>
          <div class="flex flex gap-2">
            <p class="text-4xl font-bold">{{ user.firstname }} {{ user.lastname }}</p>
            <p>
              <span class="rounded-full bg-orange-100 px-4 py-1.5 text-sm text-orange-700">{{ user.role }}</span>
            </p>
          </div>
          <p class="text-lg text-gray-600">{{ user.email }}</p>
        </div>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        <p>TODO: Hier kann hin:</p>
        <ul class="list-inside list-disc">
          <li>Form zur Datenänderung</li>
          <li>Infos zur Zugehörigkeit</li>
          <li>Statistiken?</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useAuthentication from '@/composables/useAuthentication'
import userProfileImage from '@/helpers/userProfileImage'

let { user } = useAuthentication()
</script>
