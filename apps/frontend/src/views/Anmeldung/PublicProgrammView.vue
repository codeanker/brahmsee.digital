<script setup lang="ts">
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import ProgramList from '../Verwaltung/Program/ProgramList.vue'

const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <div class="mx-auto max-w-7xl px-6 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
    <div class="mx-auto mb-16 max-w-2xl sm:text-center">
      <h2 class="text-base/7 font-semibold text-indigo-600">{{ unterveranstaltung?.veranstaltung?.name }}</h2>
      <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl sm:text-balance">
        Programm
      </p>
    </div>
  </div>

  <div class="pb-32">
    <ProgramList
      v-if="unterveranstaltung"
      :veranstaltung-id="unterveranstaltung.veranstaltungId"
    />
  </div>
</template>
