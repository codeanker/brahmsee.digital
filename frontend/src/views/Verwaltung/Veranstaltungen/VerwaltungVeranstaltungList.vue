<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import router from '@/router'

const { state: veranstaltungenList } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])

function formatDate(indate) {
  let date = new Date(indate)
  let options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString('de-DE', options)
}
</script>

<template>
  <div>
    <h5>Veranstaltungen</h5>
    <div class="flow-root">
      <p class="mt-8 text-sm text-gray-500">
        <b>Tipp</b>: Zum Bearbeiten einer Veranstaltung die entsprechende Zeile anklicken.
      </p>
      <RouterLink
        class="text-primary-600"
        to="/verwaltung/veranstaltung/erstellen"
        >Veranstaltung erstellen</RouterLink
      >
      <table class="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Id
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Zeitraum
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Meldeschluss
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              Teilnahmegebühr
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
            >
              max. TN
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr
            v-for="veranstaltung in veranstaltungenList"
            :key="veranstaltung.id"
            class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
            :title="veranstaltung.name + ' bearbeiten'"
            @click="router.push({ name: 'Veranstaltungsdetails', params: { veranstaltungId: veranstaltung.id } })"
          >
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="text-gray-900">{{ veranstaltung.id }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium text-gray-900">{{ veranstaltung.name }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium text-gray-900">
                {{ formatDate(veranstaltung.beginn) }}-{{ formatDate(veranstaltung.ende) }}
              </div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium text-gray-900">
                {{ formatDate(veranstaltung.meldeschluss) }}
              </div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium text-gray-900">{{ veranstaltung.teilnahmegebuehr }}€</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium text-gray-900">{{ veranstaltung.maxTeilnehmende }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
