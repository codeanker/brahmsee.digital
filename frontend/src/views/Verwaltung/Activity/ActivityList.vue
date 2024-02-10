<script setup lang="ts">
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
    In der Verwaltung werden bestimmte Dinge aufgezeichnet, bspw. wenn Accounts erstellt oder gelöscht werden.
  </p>

  <div class="flow-root">
    <table class="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Datum
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Beschreibung
          </th>
          <th
            scope="col"
            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
          >
            Typ
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Betroffen
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Akteur
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 bg-white">
        <!-- TODO: Detailseite und Verlinkung von Betroffen und Akteur -->
        <tr
          v-for="activity in activities"
          :key="activity.id"
          class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
          @click="onClick(activity)"
        >
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <span>
              {{ formatTimestamp(activity.timestamp) }}
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
  </div>
</template>
