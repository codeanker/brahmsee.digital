<script setup lang="ts">
import { apiClient } from '@/api'
import type { RouterOutput } from '@codeanker/api'
import { dayjs, groupBy } from '@codeanker/helpers'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

type ProgrammPunkte = RouterOutput['program']['list']

const props = defineProps<{
  veranstaltungId: string
  programm?: ProgrammPunkte
}>()

const emit = defineEmits<{
  dblclick: []
}>()

const router = useRouter()

const { state: programm } = useAsyncState(
  () => apiClient.program.list.query({ veranstaltungId: props.veranstaltungId }),
  undefined,
  {
    immediate: props.programm === undefined,
  }
)

const programmPunkte = computed(() => props.programm ?? programm.value)

const hasData = computed(() => (programmPunkte.value?.length ?? 0) > 0)

const programmGroups = computed(() =>
  groupBy(programmPunkte.value ?? [], (item) => dayjs(item.startingAt).format('dddd, DD. MMMM'))
)
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
      <template v-if="hasData">
        <template
          v-for="(list, timestamp) in programmGroups"
          :key="timestamp"
        >
          <tr class="text-xl font-bold bg-slate-50 dark:bg-slate-900/90 border-t-2">
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
            class="*:p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800/90 cursor-pointer"
            @click="
              router.currentRoute.value.meta.public
                ? undefined
                : router.push({ name: 'Verwaltung Programmpunkt bearbeiten', params: { programId: row.id } })
            "
            @dblclick="emit('dblclick')"
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
      </template>
      <template v-else>
        <tr>
          <td
            colspan="5"
            class="p-4 text-center"
          >
            <i>Es gibt noch keine Programmpunkte</i>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
