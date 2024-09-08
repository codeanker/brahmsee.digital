<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'

const route = useRoute()

const {
  state: unterveranstaltung,
  execute: fetchUnterveranstaltung,
  isLoading,
} = useAsyncState(async () => {
  return apiClient.unterveranstaltung.publicGet.query({ id: Number(route.params.ausschreibungId) })
}, undefined)
fetchUnterveranstaltung()
</script>

<template>
  <div class="lg:pb-10 lg:px-20 xl:px-28 2xl:px-40 flex flex-col h-full">
    <div
      v-if="unterveranstaltung && !isLoading"
      class="grow flex flex-col"
    >
      <!-- Header -->
      <PublicHeader
        show-profile-dropdown
        :gliederung="unterveranstaltung.gliederung"
      />
      <div class="grow p-4 flex flex-col">
        <div class="flex items-center">
          <div class="flex flex-col justify-center">
            <h3>Willkommen zurück</h3>
            <p class="mb-6">Hier kannst du deine bisherigen Anmeldungen einsehen und verwalten.</p>
          </div>
        </div>
        <h5>Aktuelle Anmeldungen</h5>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="flex items-center border rounded-lg shadow-sm overflow-hidden">
            <div class="shrink-0 flex items-center justify-center w-16 h-16 bg-green-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="h-8 aspect-square text-white"
                fill="currentColor"
              >
                <path
                  d="M278.9 2.8c5.5-3.8 12.7-3.8 18.2 0L517.3 154.7c11.3 7.8 18.7 20 20.4 33.6L571.4 458c3.6 28.6-18.8 54-47.6 54H52.2C23.4 512 1 486.7 4.6 458L38.3 188.2c1.7-13.6 9.1-25.8 20.4-33.6L278.9 2.8zM76.9 181c-3.8 2.6-6.2 6.7-6.8 11.2L36.4 462c-1.2 9.5 6.3 18 15.9 18H272V46.5L76.9 181zM405.4 480L304 288.4V480H405.4zm36.2 0h82.1c9.6 0 17.1-8.4 15.9-18L505.9 192.2c-.6-4.5-3-8.6-6.8-11.2L304 46.5V220L441.6 480z"
                />
              </svg>
            </div>
            <div class="grow flex flex-col justify-center px-4">
              <h6 class="m-0">Brahmsee 2025</h6>
              <p class="m-0">Angemeldet am: 25.04.2025</p>
            </div>
          </div>
        </div>
        <h5>Vergangene Anmeldungen</h5>
        <div class="grid grid-cols-3 gap-4 mb-6">
          <div class="flex items-center border rounded-lg shadow-sm overflow-hidden">
            <div class="shrink-0 flex items-center justify-center w-16 h-16 bg-slate-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="h-8 aspect-square"
                fill="currentColor"
              >
                <path
                  d="M278.9 2.8c5.5-3.8 12.7-3.8 18.2 0L517.3 154.7c11.3 7.8 18.7 20 20.4 33.6L571.4 458c3.6 28.6-18.8 54-47.6 54H52.2C23.4 512 1 486.7 4.6 458L38.3 188.2c1.7-13.6 9.1-25.8 20.4-33.6L278.9 2.8zM76.9 181c-3.8 2.6-6.2 6.7-6.8 11.2L36.4 462c-1.2 9.5 6.3 18 15.9 18H272V46.5L76.9 181zM405.4 480L304 288.4V480H405.4zm36.2 0h82.1c9.6 0 17.1-8.4 15.9-18L505.9 192.2c-.6-4.5-3-8.6-6.8-11.2L304 46.5V220L441.6 480z"
                />
              </svg>
            </div>
            <div class="grow flex flex-col justify-center px-4">
              <h6 class="m-0">Brahmsee 2024</h6>
              <p class="m-0">Angemeldet am: 18.04.2024</p>
            </div>
          </div>
          <div class="flex items-center border rounded-lg shadow-sm overflow-hidden">
            <div class="shrink-0 flex items-center justify-center w-16 h-16 bg-slate-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                class="h-8 aspect-square"
                fill="currentColor"
              >
                <path
                  d="M278.9 2.8c5.5-3.8 12.7-3.8 18.2 0L517.3 154.7c11.3 7.8 18.7 20 20.4 33.6L571.4 458c3.6 28.6-18.8 54-47.6 54H52.2C23.4 512 1 486.7 4.6 458L38.3 188.2c1.7-13.6 9.1-25.8 20.4-33.6L278.9 2.8zM76.9 181c-3.8 2.6-6.2 6.7-6.8 11.2L36.4 462c-1.2 9.5 6.3 18 15.9 18H272V46.5L76.9 181zM405.4 480L304 288.4V480H405.4zm36.2 0h82.1c9.6 0 17.1-8.4 15.9-18L505.9 192.2c-.6-4.5-3-8.6-6.8-11.2L304 46.5V220L441.6 480z"
                />
              </svg>
            </div>
            <div class="grow flex flex-col justify-center px-4">
              <h6 class="m-0">Brahmsee 2023</h6>
              <p class="m-0">Angemeldet am: 12.04.2023</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PublicFooter />
  </div>
</template>
