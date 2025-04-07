<script setup lang="ts">
import { computed } from 'vue'

import CircularProgress from '../UIComponents/CircularProgress.vue'

import Badge from './Badge.vue'
import Button from './Button.vue'

import type { RouterOutput } from '@codeanker/api'
import { formatDateWith } from '@codeanker/helpers'

const { veranstaltung } = defineProps<Props>()

type Veranstaltung = Awaited<
  RouterOutput['veranstaltung']['verwaltungList'] | RouterOutput['veranstaltung']['gliederungList']
>[number]

interface Props {
  veranstaltung: Veranstaltung
  hasUnterveranstaltungen?: number
}

const totalAnmeldungen = computed(() =>
  veranstaltung.unterveranstaltungen.map((u) => u._count.Anmeldung).reduce((a, b) => a + b, 0)
)
const keyInfoDateFormat = 'dddd, DD. MMMM YYYY'

const percent = computed(() => (totalAnmeldungen.value / veranstaltung.maxTeilnehmende) * 100)
</script>

<template>
  <div
    :key="veranstaltung.id"
    class="rounded-xl p-8 ring-1 ring-gray-200 dark:ring-dark-secondary dark:bg-dark-secondary"
  >
    <h2 class="text-lg font-semibold leading-8">
      {{ veranstaltung.name }}
    </h2>

    <p class="mt-4 text-sm leading-6 underline-offset-4">
      von <u>{{ formatDateWith(veranstaltung.beginn, keyInfoDateFormat) }}</u> bis
      <u>{{ formatDateWith(veranstaltung.ende, keyInfoDateFormat) }}</u>
    </p>

    <p class="text-sm leading-6">
      <span class="font-semibold">{{ totalAnmeldungen }}</span> /
      <span class="font-semibold">{{ veranstaltung.maxTeilnehmende }}</span> Plätze belegt
    </p>

    <CircularProgress
      class="py-6"
      :size="150"
      :stroke-width="15"
      :progress="percent"
      :formatter="(v) => v.toFixed(2)"
    />

    <Badge v-if="hasUnterveranstaltungen"> Ausschreibung erstellt </Badge>
    <Button
      v-else
      :to="{
        name: 'UnterveranstaltungCreate',
        params: { veranstaltungId: veranstaltung.id.toString() },
      }"
      class="mt-6 w-full"
    >
      Ausschreibung erstellen
    </Button>
  </div>
</template>
