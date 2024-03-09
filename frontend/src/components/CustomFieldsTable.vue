<script setup lang="ts">
import { CubeTransparentIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { useRouter } from 'vue-router'

import { apiClient } from '@/api'

const props = defineProps<{
  veranstaltungId: number
  // columns?: string[]
}>()

function loadFields() {
  const { state } = useAsyncState(async () => {
    return apiClient.customFields.list.query({
      // filter: {
      //   veranstaltungId: props.veranstaltungId,
      // },
      // pagination: { take: 100, skip: 0 },
      entity: 'veranstaltung',
      entityId: props.veranstaltungId,
    })
  }, [])
  return state
}

const unterveranstaltungen = loadFields()

const router = useRouter()
</script>

<template>
  <div>
    <table
      v-if="unterveranstaltungen"
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
    >
      <thead>
        <tr>
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
            Typ
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Erforderlich?
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-dark-primary">
        <tr
          v-for="unterveranstaltung in unterveranstaltungen"
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
            <div>{{ unterveranstaltung.name }}</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div>{{ unterveranstaltung.type }}</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div>{{ unterveranstaltung.required }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="unterveranstaltungen.length <= 0"
      class="rounded-md bg-blue-50 dark:bg-blue-950 p-4 text-blue-500"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <CubeTransparentIcon
            class="h-5 w-5"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm mb-0">Es wurden keine benutzerdefinierten Felder angelegt.</p>
        </div>
      </div>
    </div>
  </div>
</template>
