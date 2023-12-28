<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { useRouter } from 'vue-router'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'

const router = useRouter()

const { state: unterveranstaltungenList } = useAsyncState(async () => {
  return apiClient.unterveranstaltung.verwaltungList.query({
    filter: {},
    pagination: { take: 100, skip: 0 },
  })
}, [])

function formatDate(indate) {
  let date = new Date(indate)
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' }
  return date.toLocaleDateString('de-DE', options)
}
</script>

<template>
  <div>
    <h5>Ausschreibungen</h5>
    <div class="flow-root">
      <p class="mt-8 text-sm text-gray-500">
        <b>Tipp</b>: Zum Bearbeiten einer Ausschreibung die entsprechmeldeschluss Zeile anklicken.
      </p>
      <RouterLink
        class="text-primary-600"
        :to="{ name: 'UnterveranstaltungCreate' }"
        >Ausschreibung erstellen</RouterLink
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
              Veranstaltung
            </th>
            <th
              v-if="loggedInAccount?.role === 'ADMIN'"
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
            <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
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
    </div>
  </div>
</template>
