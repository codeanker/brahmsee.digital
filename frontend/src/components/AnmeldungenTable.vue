<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import AnmeldungStatusSelect from '@/components/AnmeldungStatusSelect.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { dayjs } from '@codeanker/helpers'

const props = withDefaults(
  defineProps<{
    unterveranstaltungId?: number
    veranstaltungId?: number
  }>(),
  {}
)

function loadAnmeldungen() {
  if (loggedInAccount.value?.role === 'ADMIN') {
    const { state } = useAsyncState(async () => {
      return apiClient.anmeldung.verwaltungList.query({
        filter: {
          unterveranstaltungId: props.unterveranstaltungId,
          veranstaltungId: props.veranstaltungId,
        },
        pagination: { take: 100, skip: 0 },
      })
    }, [])
    return state
  } else {
    const { state } = useAsyncState(async () => {
      return apiClient.anmeldung.gliederungList.query({
        filter: {
          unterveranstaltungId: props.unterveranstaltungId,
          veranstaltungId: props.veranstaltungId,
        },
        pagination: { take: 100, skip: 0 },
      })
    }, [])
    return state
  }
}
const anmeldungen = loadAnmeldungen()
</script>

<template>
  <table
    v-if="anmeldungen.length"
    class="min-w-full divide-y divide-gray-300"
  >
    <thead>
      <tr>
        <th
          scope="col"
          class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
        >
          Name
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          Alter
        </th>

        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          T-Shirt
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
        >
          Status
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white">
      <tr
        v-for="anmeldung in anmeldungen"
        :key="anmeldung.id"
        class="even:bg-gray-50 hover:bg-gray-50"
      >
        <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
          <div class="text-gray-900 flex space-x-1 items-center">
            <span>{{ anmeldung.person.firstname }} {{ anmeldung.person.lastname }}</span>
            <RouterLink
              target="_blank"
              class="text-primary-600 hover:text-primary-700"
              :to="{
                name: 'Verwaltung Persondetails',
                params: { personId: anmeldung.person.id },
              }"
            >
              <ArrowTopRightOnSquareIcon class="h-4 w-4" />
            </RouterLink>
          </div>
          <span
            v-if="loggedInAccount?.role === 'ADMIN'"
            class="text-xs text-gray-500"
            >{{ anmeldung.person.gliederung?.name }}</span
          >
        </td>
        <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <div v-if="anmeldung.person.birthday">{{ dayjs().diff(anmeldung.person.birthday, 'year') }} Jahre</div>
        </td>

        <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
          <span v-if="anmeldung.tshirtBestellt">{{ anmeldung.person.konfektionsgroesse }}</span>
          <span v-else> - </span>
        </td>
        <td class="px-3 py-5 text-sm">
          <div class="flex items-center">
            <AnmeldungStatusSelect
              v-if="anmeldung.unterveranstaltung.veranstaltung.meldeschluss"
              :id="anmeldung.id"
              :status="anmeldung.status"
              :meldeschluss="anmeldung.unterveranstaltung.veranstaltung.meldeschluss"
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div
    v-if="anmeldungen.length <= 0"
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
</template>
