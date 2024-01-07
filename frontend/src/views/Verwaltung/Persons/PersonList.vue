<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import { dayjs, formatDate } from '@codeanker/helpers'

const { state: personList, execute: fetchPersons } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    return await apiClient.person.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  } else {
    return await apiClient.person.gliederungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  }
}, [])

fetchPersons()
</script>

<template>
  <h5>Personen</h5>
  <div class="flow-root">
    <p class="mt-8 text-sm text-gray-500">
      Personen melden sich zu einer Veranstaltung an. Eine Person kann optional einem Account zugeordnet werden.
    </p>
    <RouterLink
      class="text-primary-600"
      :to="{ name: 'Verwaltung Person erstellen' }"
    >
      Person anlegen
    </RouterLink>
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
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="person in personList"
          :key="person.id"
          class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
          :title="person.firstname + ' ' + person.lastname + ' bearbeiten'"
          @click="router.push({ name: 'Verwaltung Persondetails', params: { personId: person.id } })"
        >
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="text-gray-900">{{ person.firstname }} {{ person.lastname }}</div>
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div v-if="person.birthday">
              {{ dayjs().diff(person.birthday, 'year') }} Jahre
              <br />
              {{ formatDate(person.birthday) }}
            </div>
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {{ person.gliederung?.name }}
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div class="flex items-center">
              <CheckIcon
                v-if="person.account?.id !== undefined"
                class="h-5 w-5 text-primary-600"
              ></CheckIcon>
              vorhanden
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
