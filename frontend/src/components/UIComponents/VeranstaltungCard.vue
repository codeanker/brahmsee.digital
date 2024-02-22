<script setup lang="ts">
import Badge from './Badge.vue'
import Button from './Button.vue'

import { formatDate } from '@codeanker/helpers'

interface Props {
  veranstaltung: {
    id: number
    name: string
    beginn: Date
    ende: Date

    maxTeilnehmende: number
  }
  hasUnterveranstaltungen?: number
}

const { veranstaltung } = defineProps<Props>()
</script>

<template>
  <div
    :key="veranstaltung.id"
    class="rounded-xl p-8 ring-1 ring-gray-200 dark:ring-dark-secondary dark:bg-dark-secondary"
  >
    <h2 class="text-lg font-semibold leading-8">
      {{ veranstaltung.name }}
    </h2>

    <p class="mt-4 text-sm leading-6">
      vom {{ formatDate(veranstaltung.beginn) }} bis
      {{ formatDate(veranstaltung.ende) }}
    </p>
    <p class="mt-6 flex items-baseline gap-x-1">
      <span class="text-4xl font-bold tracking-tight hidden">10</span>
      <span class="text-sm font-semibold leading-6">Insgesamt {{ veranstaltung.maxTeilnehmende }} Plätze</span>
    </p>
    <Badge v-if="hasUnterveranstaltungen"> Ausschreibung erstellt </Badge>
    <Button
      v-else
      :to="{
        name: 'UnterveranstaltungCreate',
        params: { veranstaltungId: veranstaltung.id.toString() },
      }"
      class="mt-6 w-full"
      >Ausschreibung erstellen</Button
    >
  </div>
</template>
