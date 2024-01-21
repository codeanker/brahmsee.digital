<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { useVeranstaltung } from '../../../composables/useVeranstaltung'

import { apiClient } from '@/api'
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
  <table class="min-w-full divide-y divide-gray-300">
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
        <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          Größe <span v-if="anmeldung.tshirtBestellt">{{ anmeldung.person.konfektionsgroesse }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
