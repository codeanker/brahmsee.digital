<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRouter } from 'vue-router'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  veranstaltungId?: any
  columns?: string[]
}>()

const { state: unterveranstaltungenList } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.verwaltungList.query({
    filter: {
      veranstaltungId: props.veranstaltungId,
    },
    pagination: { take: 100, skip: 0 },
  })
}, [])

const router = useRouter()

function formatDate(indate) {
  let date = new Date(indate)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString('de-DE', options)
}
</script>

<template>
  <div>
    <table
      v-if="unterveranstaltungenList"
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Id
          </th>
          <th
            v-if="columns?.includes('veranstaltung')"
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Veranstaltung
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Gliederung
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
            Gebühr
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            max. TN
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white dark:bg-dark-primary">
        <tr
          v-for="unterveranstaltung in unterveranstaltungenList"
          :key="unterveranstaltung.id"
          class="cursor-pointer even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          title="bearbeiten"
          @click="
            router.push({
              name: 'UnterveranstaltungDetail',
              params: { unterveranstaltungId: unterveranstaltung.id },
            })
          "
        >
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div>{{ unterveranstaltung.id }}</div>
          </td>
          <td
            v-if="columns?.includes('veranstaltung')"
            class="py-5 pl-4 pr-3 text-sm"
          >
            <div>{{ unterveranstaltung.veranstaltung.name }}</div>
          </td>
          <td
            v-if="loggedInAccount?.role === 'ADMIN'"
            class="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
          >
            <div>{{ unterveranstaltung.gliederung.name }}</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium">
              {{ formatDate(unterveranstaltung.meldeschluss) }}
            </div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium">{{ unterveranstaltung.teilnahmegebuehr }}€</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium">{{ unterveranstaltung.maxTeilnehmende }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="unterveranstaltungenList.length <= 0"
      class="rounded-md bg-blue-50 dark:bg-blue-950 p-4 text-blue-500"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <CheckCircleIcon
            class="h-5 w-5"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm mb-0">Es gibt bisher keine Anmeldungen.</p>
        </div>
      </div>
    </div>
  </div>
</template>
