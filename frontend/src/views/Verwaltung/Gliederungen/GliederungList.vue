<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import router from '@/router'

const { state: gliederungenList } = useAsyncState(async () => {
  return apiClient.gliederung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])
</script>

<template>
  <div>
    <h5>Gliederungen</h5>
    <div class="flow-root">
      <p class="mt-8 text-sm text-gray-500">
        <b>Tipp</b>: Zum Bearbeiten einer Gliederung die entsprechende Zeile anklicken.
      </p>
      <RouterLink
        class="text-primary-600"
        :to="{ name: 'Verwaltung Gliederung Erstellen' }"
        >Gliederung erstellen</RouterLink
      >
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              EDV
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              Gliederung
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-dark-primary">
          <tr
            v-for="gliederung in gliederungenList"
            :key="gliederung.id"
            class="cursor-pointer even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            :title="gliederung.name + ' bearbeiten'"
            @click="router.push({ name: 'Verwaltung Gliederungsdetails', params: { gliederungId: gliederung.id } })"
          >
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div>{{ gliederung.edv }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">{{ gliederung.name }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
