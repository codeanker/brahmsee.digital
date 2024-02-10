<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import Badge from '@/components/UIComponents/Badge.vue'
import type { StatusColors } from '@/helpers/getAnmeldungStatusColors'
import router from '@/router'
import type { Activity, ActivityType } from '@codeanker/api'
import { formatTimestamp } from '@codeanker/helpers'

const { state: activities } = useAsyncState(async () => {
  return await apiClient.activity.verwaltungList.query({
    filter: {},
    pagination: { take: 100, skip: 0 },
  })
}, [])

function colorFromType(type: ActivityType): StatusColors {
  switch (type) {
    case 'CREATE':
      return 'secondary'
    case 'UPDATE':
      return 'warning'
    case 'DELETE':
      return 'danger'
    default:
      return 'muted'
  }
}

function onClick({ subjectType, subjectId }: Activity) {
  switch (subjectType) {
    case 'ort':
      router.push({
        name: 'Verwaltung Ortdetails',
        params: {
          ortId: subjectId,
        },
      })
      break
    default:
      break
  }
}
</script>

<template>
  <h5>Aufgezeichnete Aktivitäten</h5>
  <p class="max-w-2xl text-sm text-gray-500">
    In der Verwaltung werden Aktivitäten aufgezeichnet, z.B. wenn Accounts erstellt oder gelöscht werden.
  </p>

  <div class="flow-root">
    <table
      v-if="activities.length > 0"
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold"
          >
            Datum
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold"
          >
            Beschreibung
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold"
          >
            Typ
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Betroffen
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Akteur
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-dark-primary">
        <!-- TODO: Detailseite und Verlinkung von Betroffen und Akteur -->
        <tr
          v-for="activity in activities"
          :key="activity.id"
          class="cursor-pointer even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="onClick(activity)"
        >
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <span>
              {{ formatTimestamp(activity.createdAt) }}
            </span>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <span>
              {{ activity.description ?? '-' }}
            </span>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <Badge :color="colorFromType(activity.type)">
              {{ activity.type }}
            </Badge>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <span> {{ activity.subjectType }} #{{ activity.subjectId }} </span>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <span> {{ activity.causer?.person.firstname }} {{ activity.causer?.person.lastname }} </span>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="activities.length <= 0"
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
