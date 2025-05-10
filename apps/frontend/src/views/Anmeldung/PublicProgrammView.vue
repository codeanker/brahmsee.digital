<script setup lang="ts">
import { useRouteParams } from '@vueuse/router'
import ProgramList from '../Verwaltung/Program/ProgramList.vue'
import { useAsyncState } from '@vueuse/core'
import { apiClient } from '@/api'
import InfoList from '@/components/UIComponents/InfoList.vue'

const veranstaltungId = useRouteParams('veranstaltungId', '', {
  transform: (id) => parseInt(id),
})

const { state: veranstaltung } = useAsyncState(
  () => {
    if (!veranstaltungId.value) {
      return null
    }

    return apiClient.veranstaltung.publicGet.query(veranstaltungId.value)
  },
  null,
  { immediate: true }
)

const keyInfos = [
  {
    title: 'Veranstaltungort',
    value: 123,
  },
  {
    title: 'Veranstaltungsort',
    value: 'Musterstraße 123, 12345 Musterstadt',
  },
  {
    title: 'Veranstaltungsdatum',
    value: '01.01.2023 - 02.01.2023',
  },
]
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div
      class="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
      aria-hidden="true"
    >
      <!-- eslint-disable vue/no-static-inline-styles-->
      <div
        class="aspect-[801/801] w-[50.0625rem] bg-gradient-to-tr from-[#16a34a] to-[#0e5126] opacity-30"
        style="
          clip-path: polygon(
            63.1% 29.5%,
            100% 17.1%,
            76.6% 3%,
            48.4% 0%,
            44.6% 4.7%,
            54.5% 25.3%,
            59.8% 49%,
            55.2% 57.8%,
            44.4% 57.2%,
            27.8% 47.9%,
            35.1% 81.5%,
            0% 97.7%,
            39.2% 100%,
            35.2% 81.4%,
            97.2% 52.8%,
            63.1% 29.5%
          );
        "
      />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
      <div>
        <h2 class="text-base/7 font-semibold text-indigo-600">{{ veranstaltung?.name }}</h2>
        <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">Programm</h1>
        <p class="text-gray-700">
          Hier findest du die aktuelle Programmübersicht für die Veranstaltung {{ veranstaltung?.name }}
        </p>
      </div>
      <div class="bg-white rounded-lg border p-4 lg:p-8">
        <p>Veranstaltungsinfos</p>
        <div class="text-xs lg:text-base">
          <InfoList :infos="keyInfos" />
        </div>
      </div>
    </div>
    <div class="bg-white rounded-lg border p-2 overflow-x-auto">
      <ProgramList :veranstaltung-id="veranstaltungId" />
    </div>
  </div>
</template>
