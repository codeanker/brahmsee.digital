<script lang="ts" setup>
import InfoList from '@/components/UIComponents/InfoList.vue'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { formatDate } from '@vueuse/core'
import { computed } from 'vue'

const unterveranstaltung = injectUnterveranstaltung()

interface KeyInfo {
  title: string
  value: string
  small?: boolean
}

const keyInfos = computed<KeyInfo[]>(() => {
  if (!unterveranstaltung?.value) {
    return []
  }

  return [
    {
      title: 'Beginn',
      value: formatDate(unterveranstaltung.value.veranstaltung.beginn, 'DD.MM.YYYY, HH:mm [Uhr]'),
    },
    {
      title: 'Ende',
      value: formatDate(unterveranstaltung.value.veranstaltung.ende, 'DD.MM.YYYY, HH:mm [Uhr]'),
    },
    { title: 'Meldeschluss', value: formatDate(unterveranstaltung.value.meldeschluss, 'DD.MM.YYYY') },
    { title: 'Veranstaltungsort', value: unterveranstaltung.value.veranstaltung.ort?.name ?? '' },
    { title: 'Teilnahmebeitrag', value: unterveranstaltung.value.teilnahmegebuehr + '€' },
    { title: 'Zielgruppe', value: unterveranstaltung.value.veranstaltung.zielgruppe ?? '' },
  ]
})

const stats = computed(() => {
  const anmeldungen = unterveranstaltung?.value?._count.Anmeldung ?? 0
  const freiePlaetze = (unterveranstaltung?.value?.maxTeilnehmende ?? 0) - anmeldungen

  const stats: { label: string; value: number }[] = []
  stats.push({ label: 'Freie Plätze', value: freiePlaetze })
  stats.push({ label: 'Anmeldungen', value: anmeldungen })
  return stats
})
</script>

<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div
        class="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-16 sm:gap-y-24 lg:mx-0 lg:max-w-none lg:grid-cols-2 relative"
      >
        <div>
          <div class="text-base/7 text-gray-700 lg:max-w-lg">
            <h1 class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
              {{ unterveranstaltung?.landingSettings?.eventDetailsTitle }}
            </h1>
            <!-- eslint-disable vue/no-v-html -->
            <div
              class="max-w-xl prose dark:prose-invert"
              v-html="unterveranstaltung?.landingSettings?.eventDetailsContent"
            />
          </div>
          <dl class="mt-10 grid grid-cols-2 gap-8 border-t border-gray-900/10 pt-10 sm:grid-cols-4">
            <div
              v-for="(stat, statIdx) in stats"
              :key="statIdx"
            >
              <dt class="text-sm/6 font-semibold text-gray-600">{{ stat.label }}</dt>
              <dd class="mt-2 text-3xl/10 font-bold tracking-tight text-gray-900">{{ stat.value }}</dd>
            </div>
          </dl>
          <div class="mt-10 flex">
            <RouterLink
              class="text-base/7 font-semibold text-primary-600"
              :to="{ name: 'Public Anmeldung' }"
            >
              Melde dich jetzt bis zum
              <span v-if="unterveranstaltung">{{ formatDate(unterveranstaltung?.meldeschluss, 'DD.MM') }}</span> an
              <span aria-hidden="true">&rarr;</span>
            </RouterLink>
          </div>
        </div>
        <div class="lg:pr-4">
          <p class="text-base/7 font-semibold text-gray-500">Veranstaltungsinfos</p>
          <InfoList :infos="keyInfos" />
        </div>
      </div>
    </div>
  </div>
</template>
