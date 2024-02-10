<script setup lang="ts">
import Badge from './Badge.vue'
import Button from './Button.vue'

interface Props {
  veranstaltung: {
    id: number
    name: string
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
    <p class="mt-4 text-sm leading-6">Beschreibung der Veranstaltung</p>
    <p class="mt-6 flex items-baseline gap-x-1">
      <span class="text-4xl font-bold tracking-tight">10</span>
      <span class="text-sm font-semibold leading-6">/500 Plätzen</span>
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

    <ul
      role="list"
      class="mt-8 space-y-3 text-sm leading-6"
    >
      <li class="flex gap-x-3">
        <svg
          class="h-6 w-5 flex-none text-primary-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd"
          />
        </svg>
        Unterkunft und Verpflegung
      </li>
      <li class="flex gap-x-3">
        <svg
          class="h-6 w-5 flex-none text-primary-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd"
          />
        </svg>
        Rahmenprogramm
      </li>
    </ul>
  </div>
</template>
