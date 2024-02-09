<script setup lang="ts">
import { ArrowTopRightOnSquareIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'

import { apiClient } from '@/api'
import AnmeldungStatusSelect from '@/components/AnmeldungStatusSelect.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import { type AnmeldungStatus, AnmeldungStatusMapping } from '@codeanker/api'
import { dayjs } from '@codeanker/helpers'

const props = withDefaults(
  defineProps<{
    unterveranstaltungId?: number
    veranstaltungId?: number
    showStats?: boolean
  }>(),
  {}
)

const { state: anmeldungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    return apiClient.anmeldung.verwaltungList.query({
      filter: {
        unterveranstaltungId: props.unterveranstaltungId,
        veranstaltungId: props.veranstaltungId,
      },
      pagination: { take: 100, skip: 0 },
    })
  } else {
    return apiClient.anmeldung.gliederungList.query({
      filter: {
        unterveranstaltungId: props.unterveranstaltungId,
        veranstaltungId: props.veranstaltungId,
      },
      pagination: { take: 100, skip: 0 },
    })
  }
}, [])

const { state: countAnmeldungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    return apiClient.anmeldung.verwaltungCount.query({
      filter: {
        unterveranstaltungId: props.unterveranstaltungId,
        veranstaltungId: props.veranstaltungId,
      },
    })
  }
}, [])

// @ToDo count for Gliederungen

const stats = computed<
  {
    name: AnmeldungStatus
    value: number
  }[]
>(() => {
  return [
    { name: 'OFFEN', value: countAnmeldungen.value.OFFEN },
    { name: 'BESTAETIGT', value: countAnmeldungen.value.BESTAETIGT },
    { name: 'STORNIERT', value: countAnmeldungen.value.STORNIERT },
    { name: 'ABGELEHNT', value: countAnmeldungen.value.ABGELEHNT },
  ]
})
</script>

<template>
  <!-- Stats-->
  <div
    v-if="showStats"
    class="grid grid-cols-2 gap-px lg:grid-cols-4 mb-6"
  >
    <div
      v-for="stat in stats"
      :key="stat.name"
      class=""
    >
      <div class="flex items-start space-x-2 text-sm">
        <div
          class="w-4 h-4 mt-1 rounded-full shrink-0"
          :class="`bg-${getAnmeldungStatusColor(stat.name)}-600`"
        ></div>
        <div>
          <div class="text-sm font-medium">{{ AnmeldungStatusMapping[stat.name].human }}</div>
          <p class="flex items-baseline gap-x-2">
            <span class="text-2xl font-semibold tracking-tight">{{ stat.value }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Stats-->
  <table
    v-if="anmeldungen.length"
    class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
  >
    <thead>
      <tr>
        <th
          scope="col"
          class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold"
        >
          Name
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold"
        >
          Alter
        </th>

        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold"
        >
          T-Shirt
        </th>
        <th
          scope="col"
          class="px-3 py-3.5 text-left text-sm font-semibold"
        >
          Status
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 bg-white dark:bg-dark-primary">
      <tr
        v-for="anmeldung in anmeldungen"
        :key="anmeldung.id"
        class="even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
          <div class="flex space-x-1 items-center">
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
            class="text-xs"
            >{{ anmeldung.person.gliederung?.name }}</span
          >
        </td>
        <td class="whitespace-nowrap px-3 py-5 text-sm">
          <div v-if="anmeldung.person.birthday">{{ dayjs().diff(anmeldung.person.birthday, 'year') }} Jahre</div>
        </td>

        <td class="whitespace-nowrap px-3 py-5 text-sm">
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
    class="rounded-md bg-blue-50 dark:bg-blue-950 text-blue-500 p-4"
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
</template>
