<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import { useRouteTitle } from '@/composables/useRouteTitle'
import router from '@/router'

const { state: gliederungenList } = useAsyncState(async () => {
  return apiClient.gliederung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])

const { setTitle } = useRouteTitle()
setTitle('Gliederungen')
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten einer Gliederung die entsprechende Zeile anklicken.</p>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Gliederung Erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
        Gliederung erstellen
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
