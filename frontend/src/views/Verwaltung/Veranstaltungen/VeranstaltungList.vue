<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import { useRouteTitle } from '@/composables/useRouteTitle'
import router from '@/router'

const { setTitle } = useRouteTitle()
setTitle('Veranstaltungen')

const { state: veranstaltungenList } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])

function formatDate(indate) {
  let date = new Date(indate)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString('de-DE', options)
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex flex-col">
        <p class="text-sm"><b>Tipp</b>: Zum Bearbeiten einer Veranstaltung die entsprechende Zeile anklicken.</p>
      </div>
      <RouterLink
        class="text-primary-500 flex items-center"
        :to="{ name: 'Verwaltung Veranstaltung erstellen' }"
      >
        <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
        Veranstaltung erstellen
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
              Zeitraum
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              Meldeschluss
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              Teilnahmegebühr
            </th>
            <th
              scope="col"
              class="px-3 py-3.5 text-left text-sm font-semibold"
            >
              max. TN
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-dark-primary">
          <tr
            v-for="veranstaltung in veranstaltungenList"
            :key="veranstaltung.id"
            class="cursor-pointer even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            :title="veranstaltung.name + ' bearbeiten'"
            @click="
              router.push({ name: 'Verwaltung Veranstaltungsdetails', params: { veranstaltungId: veranstaltung.id } })
            "
          >
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div>{{ veranstaltung.id }}</div>
            </td>
            <td class="py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">{{ veranstaltung.name }}</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">
                {{ formatDate(veranstaltung.beginn)
                }}<span v-if="veranstaltung.beginn.getTime() !== veranstaltung.ende.getTime()"
                  >-{{ formatDate(veranstaltung.ende) }}</span
                >
              </div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">
                {{ formatDate(veranstaltung.meldeschluss) }}
              </div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">{{ veranstaltung.teilnahmegebuehr }}€</div>
            </td>
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
              <div class="font-medium">{{ veranstaltung.maxTeilnehmende }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
