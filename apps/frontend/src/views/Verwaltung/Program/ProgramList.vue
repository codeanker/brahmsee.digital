<script setup lang="ts">
import { apiClient } from '@/api'
import cn from '@/helpers/cn'
import { dayjs, groupBy } from '@codeanker/helpers'
import { useAsyncState, useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

const { veranstaltungId } = defineProps<{
  veranstaltungId: number
}>()

const { state: programm } = useAsyncState(() => apiClient.program.list.query({ veranstaltungId }), undefined, {
  immediate: true,
})

const programmGroups = computed(() =>
  groupBy(programm.value ?? [], (item) => dayjs(item.startingAt).format('dddd, DD. MMMM'))
)

const highlighted = useLocalStorage<string[]>(`program-highlight-v-${veranstaltungId}`, [])

function toggleHighlight(name: string) {
  if (highlighted.value.includes(name)) {
    const index = highlighted.value.indexOf(name)
    highlighted.value.splice(index, 1)
  } else {
    highlighted.value.push(name)
  }
}
</script>

<template>
  <table class="w-full select-none">
    <thead>
      <tr class="*:p-4 font-bold">
        <td>Startzeit</td>
        <td>Endzeit</td>
        <td>Programmpunkt</td>
        <td>Ort</td>
        <td>Verantwortlich</td>
      </tr>
    </thead>
    <tbody>
      <template
        v-for="(list, timestamp) in programmGroups"
        :key="timestamp"
      >
        <tr class="text-xl font-bold bg-slate-50 border-t-2">
          <td
            colspan="5"
            class="p-4"
          >
            {{ timestamp }}
          </td>
        </tr>
        <tr
          v-for="(row, index) in list"
          :key="index"
          :class="
            cn(
              '*:p-2 transition-colors hover:bg-slate-200 cursor-pointer',
              highlighted.includes(row.name) ? 'odd:bg-primary-600 bg-primary-500' : 'odd:bg-slate-100'
            )
          "
          @click="() => toggleHighlight(row.name)"
        >
          <td>
            <strong>{{ dayjs(row.startingAt).format('HH:mm [Uhr]') }}</strong>
          </td>
          <td>
            <strong>{{ dayjs(row.endingAt).format('HH:mm [Uhr]') }}</strong>
          </td>
          <td>{{ row.name }}</td>
          <td>{{ row.location }}</td>
          <td>{{ row.responsible }}</td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
