<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import { useRouteTitle } from '@/composables/useRouteTitle'
import router from '@/router'

const { setTitle } = useRouteTitle()

const { state: ortenList } = useAsyncState(async () => {
  const result = await apiClient.ort.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  setTitle('Orte')
  return result
}, [])
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten eines Ortes die entsprechende Zeile anklicken.</p>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Ort erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
        Ort erstellen
      </RouterLink>
    </div>
    <div class="flow-root">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              Id
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              Ort
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-dark-primary">
          <tr
            v-for="ort in ortenList"
            :key="ort.id"
            class="cursor-pointer even:bg-gray-50 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800"
            :title="ort.name + ' bearbeiten'"
            @click="router.push({ name: 'Verwaltung Ortdetails', params: { ortId: ort.id } })"
          >
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div>{{ ort.id }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">{{ ort.name }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">{{ ort.address?.city }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
