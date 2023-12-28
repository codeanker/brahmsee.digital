<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'

const { state: veranstaltungenList } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])
</script>

<template>
  <div class="dashboard">
    <h5>Aktuelle Veranstaltungen</h5>

    <div class="mx-auto mt-16 max-w-7xlsm:mt-32">
      <div
        class="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl lg:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none"
      >
        <div
          v-for="veranstaltung in veranstaltungenList"
          :key="veranstaltung.id"
          class="rounded-xl p-8 ring-1 ring-gray-200"
        >
          <h2 class="text-lg font-semibold leading-8 text-gray-900">
            {{ veranstaltung.name }}
          </h2>
          <p class="mt-4 text-sm leading-6 text-gray-600">Beschreibung der Veranstaltung</p>
          <p class="mt-6 flex items-baseline gap-x-1">
            <span class="text-4xl font-bold tracking-tight text-gray-900">10</span>
            <span class="text-sm font-semibold leading-6 text-gray-600">/500 Plätzen</span>
          </p>
          <a
            class="cursor-pointer mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300"
            >Ausschreibung erstellen</a
          >
          <ul
            role="list"
            class="mt-8 space-y-3 text-sm leading-6 text-gray-600"
          >
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-primary-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Unterkunft und Verpflegung
            </li>
            <li class="flex gap-x-3">
              <svg
                class="h-6 w-5 flex-none text-primary-600"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clip-rule="evenodd"
                />
              </svg>
              Rahmenprogramm
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Logo cloud -->
    <div class="mx-auto mt-24 max-w-7xl px-6 sm:mt-32 lg:px-8">
      <div
        class="mx-auto grid max-w-lg grid-cols-4 items-end gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5"
      >
        <img
          class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          src="@/assets/images/sponsoren/codeanker.png"
          alt="CODEANKER"
          width="158"
          height="48"
        />
        <img
          class="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
          src="@/assets/images/sponsoren/provinzial.png"
          alt="Provinzial"
          width="158"
          height="48"
        />
      </div>
      <div class="mt-16 flex justify-center">
        <p
          class="relative rounded-full bg-gray-50 px-4 py-1.5 text-sm leading-6 text-gray-600 ring-1 ring-inset ring-gray-900/5"
        >
          <span class="hidden md:inline"
            >Förder:innen und Sponsor:innen unterstützen unsere Veranstaltungen durch Geld- und Sachspenden</span
          >
        </p>
      </div>
    </div>
  </div>
</template>
