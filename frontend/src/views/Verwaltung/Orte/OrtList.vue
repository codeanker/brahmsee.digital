<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import router from '@/router'

const { state: ortenList } = useAsyncState(async () => {
  return apiClient.ort.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])
</script>

<template>
  <div>
    <h5>Orte</h5>
    <div class="flow-root">
      <p class="mt-8 text-sm"><b>Tipp</b>: Zum Bearbeiten eines Ortes die entsprechende Zeile anklicken.</p>
      <RouterLink
        class="text-primary-500"
        :to="{ name: 'Verwaltung Ort erstellen' }"
        >Ort erstellen</RouterLink
      >
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
