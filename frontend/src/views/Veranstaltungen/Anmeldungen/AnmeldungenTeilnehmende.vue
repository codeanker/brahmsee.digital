<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { useVeranstaltung } from '../../../composables/useVeranstaltung'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import { dayjs, formatDate } from '@codeanker/helpers'

const { veranstaltung } = useVeranstaltung()

const { state: anmeldungen } = useAsyncState(
  async () => {
    return apiClient.anmeldung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  },
  [],
  {
    immediate: true,
  }
)
</script>

<template>
  <div class="my-10 flex justify-between">
    <div>
      <div class="text-lg font-semibold text-gray-900">Teilnehmende "{{ veranstaltung?.name }}"</div>
      <p class="max-w-2xl text-sm text-gray-500">
        Hier findest Du alle Personen die sich zur Veranstaltung "{{ veranstaltung?.name }}" angemeldet haben.
      </p>
    </div>
  </div>
  <table
    v-if="anmeldungen.length"
    class="min-w-full divide-y divide-gray-300"
  >
    <thead>
      <tr>
        <th
          scope="col"
          class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
        >
          Name
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          Alter
        </th>
        <th
          v-if="loggedInAccount?.role === 'ADMIN'"
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          Gliederung
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          Account
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          T-Shirt
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      <tr
        v-for="anmeldung in anmeldungen"
        :key="anmeldung.id"
        class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
        :title="anmeldung.person.firstname + ' ' + anmeldung.person.lastname + ' bearbeiten'"
        @click="router.push({ name: 'Verwaltung Persondetails', params: { personId: anmeldung.person.id } })"
      >
        <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
          <div class="text-gray-900">{{ anmeldung.person.firstname }} {{ anmeldung.person.lastname }}</div>
        </td>
        <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <div v-if="anmeldung.person.birthday">
            {{ dayjs().diff(anmeldung.person.birthday, 'year') }} Jahre
            <br />
            {{ formatDate(anmeldung.person.birthday) }}
          </div>
        </td>
        <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          {{ anmeldung.person.gliederung?.name }}
        </td>
        <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <div class="flex items-center">Todo: {{ anmeldung.status }}</div>
        </td>
        <td
          v-if="loggedInAccount?.role === 'ADMIN'"
          class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"
        >
          Größe <span v-if="anmeldung.tshirtBestellt">{{ anmeldung.person.konfektionsgroesse }}</span>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    v-if="anmeldungen.length <= 0"
    class="rounded-md bg-blue-50 p-4"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon
          class="h-5 w-5 text-blue-400"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <p class="text-sm text-blue-700 mb-0">Es gibt bisher keine Anmeldungen.</p>
      </div>
    </div>
  </div>
</template>
