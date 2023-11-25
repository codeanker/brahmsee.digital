<script setup lang="ts">
import { ArrowPathIcon, UsersIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '../../api'

import BasicHeader from '@/components/LayoutComponents/BasicHeader.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import personProfileImage from '@/helpers/personProfileImage'
import router from '@/router'

const { state: personList, execute: fetchPersons } = useAsyncState(async () => {
  const result = await apiClient.person.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  return result
}, [])

fetchPersons()
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <BasicHeader
      title="Benutzer"
      subtitle="Liste aller Benutzer mit Zugriff auf dieses System."
    >
      <template #content>
        <div class="flex flex-row gap-4">
          <Button
            :to="{ name: 'UserCreate' }"
            color="primary"
          >
            Hinzufügen</Button
          >
          <Button
            color="secondary"
            @click="fetchPersons"
          >
            <ArrowPathIcon class="h-5 w-5" />
          </Button>
        </div>
      </template>
      <template #icon>
        <UsersIcon class="h-8 w-8" />
      </template>
    </BasicHeader>
    <div class="flow-root">
      <p class="mt-8 text-sm text-gray-500">
        <b>Tipp</b>: Zum Bearbeiten eines Nutzers die entsprechende Zeile anklicken.
      </p>
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
              Title
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Status
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
            @click="router.push({ name: 'UserDetail', params: { personId: person.id } })"
          >
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="flex items-center">
                <div class="h-11 w-11 flex-shrink-0">
                  <img
                    class="h-11 w-11 rounded-full"
                    :src="personProfileImage(person)"
                    alt=""
                  />
                </div>
                <div class="ml-4">
                  <div class="font-medium text-gray-900">{{ person.firstname }} {{ person.lastname }}</div>
                  <div class="mt-1 text-gray-500">{{ person.id }}</div>
                </div>
                <Badge
                  v-if="person.id === loggedInAccount?.id"
                  class="ml-4"
                  >Du</Badge
                >
              </div>
            </td>
            <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <div class="text-gray-900">Arbeitsbereich</div>
              <div class="mt-1 text-gray-500">Zusatzinfo</div>
            </td>
            <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <span
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >
                Active
              </span>
            </td>
            <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
