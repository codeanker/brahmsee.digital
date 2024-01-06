<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import UserLogo from '@/components/UIComponents/UserLogo.vue'
import router from '@/router'

const { state: personList, execute: fetchPersons } = useAsyncState(async () => {
  const result = await apiClient.person.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  return result
}, [])

fetchPersons()
</script>

<template>
  <h5>Benutzer</h5>
  <div class="flow-root">
    <p class="mt-8 text-sm text-gray-500">
      <b>Tipp</b>: Zum Bearbeiten eines Nutzers die entsprechende Zeile anklicken.
    </p>
    <RouterLink
      class="text-primary-600"
      :to="{ name: 'Verwaltung Person erstellen' }"
      >Person erstellen</RouterLink
    >
    <table class="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            width="12px"
            class="text-sm text-gray-900"
          >
            A
          </th>
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
            Geburtsdatum
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
            Rolle
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <tr
          v-for="person in personList"
          :key="person.id"
          class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
          :title="person.firstname + ' ' + person.lastname + ' bearbeiten'"
          @click="router.push({ name: 'Verwaltung Benutzerdetails', params: { personId: person.id } })"
        >
          <td class="whitespace-nowrap px-3">
            <div class="h-9 w-9 flex-shrink-0">
              <UserLogo :name="person.firstname + ' ' + person.lastname" />
            </div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium text-gray-900">{{ person.firstname }} {{ person.lastname }}</div>
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {{ person.birthday }}
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            {{ person.gliederungId }}
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
