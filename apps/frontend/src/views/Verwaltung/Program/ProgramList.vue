<script setup lang="ts">
import { apiClient } from '@/api'
import { dayjs } from '@codeanker/helpers'
import { useAsyncState } from '@vueuse/core'

const { veranstaltungId } = defineProps<{
  veranstaltungId: number
}>()

const { state: programm } = useAsyncState(() => apiClient.program.list.query({ veranstaltungId }), undefined, {
  immediate: true,
})
</script>

<template>
  <template
    v-for="[timestamp, list] in programm"
    :key="timestamp"
  >
    <p class="text-xl font-bold mt-12">
      {{ dayjs(timestamp).format('dddd, DD. MMMM') }}
    </p>

    <table class="w-full">
      <thead>
        <tr class="*:p-4 bg-gray-300">
          <td>Startzeit</td>
          <td>Endzeit</td>
          <td>Programmpunkt</td>
          <td>Ort</td>
          <td>Verantwortlich</td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in list"
          :key="index"
          class="*:p-2 even:bg-gray-100 transition-colors hover:bg-gray-200"
        >
          <td>{{ dayjs(row.startingAt).format('HH:mm [Uhr]') }}</td>
          <td>{{ dayjs(row.endingAt).format('HH:mm [Uhr]') }}</td>
          <td>{{ row.name }}</td>
          <td>{{ row.location }}</td>
          <td>{{ row.responsible }}</td>
        </tr>
      </tbody>
    </table>
  </template>
</template>
