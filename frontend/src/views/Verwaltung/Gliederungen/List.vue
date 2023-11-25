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
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              EDV
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Gliederung
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="gliederung in gliederungenList"
            :key="gliederung.id"
            class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
            :title="gliederung.name + ' bearbeiten'"
            @click="router.push({ name: 'Gliederungsdetails', params: { gliederungId: gliederung.id } })"
          >
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="text-gray-900">{{ gliederung.edv }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium text-gray-900">{{ gliederung.name }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
