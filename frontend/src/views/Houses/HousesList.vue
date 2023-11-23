<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <BasicHeader
      title="Häuser und Zeltplätze"
      subtitle="Liste aller Häuser und Zeltplätze."
    >
      <template #content>
        <div class="flex flex-row gap-4">
          <Button color="primary">Hinzufügen</Button>
          <Button
            color="secondary"
            @click="fetchUsers"
          >
            <ArrowPathIcon class="h-5 w-5" />
          </Button>
        </div>
      </template>
      <template #icon>
        <HomeIcon class="h-8 w-8" />
      </template>
    </BasicHeader>

    <div class="mt-8 flow-root">
      <p class="mt-8 text-sm text-gray-500">
        <b>Tipp</b>: Zum Bearbeiten eines Eintrags die entsprechende Zeile anklicken.
      </p>
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Typ
            </th>
            <th
              scope="col"
              class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Kapazität
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Belegung
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="user in userList"
            :key="user.email"
            class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
            :title="user.firstname + ' ' + user.lastname + ' bearbeiten'"
            @click="router.push({ name: 'HouseDetail', params: { houseId: user.id } })"
          >
            <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <div class="text-gray-900">Zelt oder Haus</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
              <div class="text-gray-900">Gustav-Wulf-Haus</div>
            </td>
            <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <div class="text-gray-900">30 Belegt</div>
              <div class="mt-1 text-gray-500">200 Schlafplätze</div>
            </td>
            <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
              <span
                class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
              >
                30/35
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowPathIcon, HomeIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '../../api'

import BasicHeader from '@/components/BasicHeader.vue'
import Button from '@/components/Button.vue'
import router from '@/router'

const { state: userList, execute: fetchUsers } = useAsyncState(async () => {
  const result = await apiClient.user.managementList.query({ pagination: { take: 100 }, filter: {} })
  return result
}, [])
fetchUsers()
</script>
