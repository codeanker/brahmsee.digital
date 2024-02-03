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
      class="min-w-full divide-y divide-gray-300"
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Id
          </th>
          <th
            v-if="columns?.includes('veranstaltung')"
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Veranstaltung
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Gliederung
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
            Gebühr
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
          v-for="unterveranstaltung in unterveranstaltungenList"
          :key="unterveranstaltung.id"
          class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
          title="bearbeiten"
          @click="
            router.push({
              name: 'UnterveranstaltungDetail',
              params: { unterveranstaltungId: unterveranstaltung.id },
            })
          "
        >
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="text-gray-900">{{ unterveranstaltung.id }}</div>
          </td>
          <td
            v-if="columns?.includes('veranstaltung')"
            class="py-5 pl-4 pr-3 text-sm"
          >
            <div class="text-gray-900">{{ unterveranstaltung.veranstaltung.name }}</div>
          </td>
          <td
            v-if="loggedInAccount?.role === 'ADMIN'"
            class="whitespace-nowrap py-5 pl-4 pr-3 text-sm"
          >
            <div class="text-gray-900">{{ unterveranstaltung.gliederung.name }}</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium text-gray-900">
              {{ formatDate(unterveranstaltung.meldeschluss) }}
            </div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium text-gray-900">{{ unterveranstaltung.teilnahmegebuehr }}€</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div class="font-medium text-gray-900">{{ unterveranstaltung.maxTeilnehmende }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="unterveranstaltungenList.length <= 0"
      class="rounded-md bg-blue-50 p-4"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <CheckCircleIcon
            class="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm text-blue-700 mb-0">Es gibt bisher keine Anmeldungen.</p>
        </div>
      </div>
    </div>
  </div>
</template>
