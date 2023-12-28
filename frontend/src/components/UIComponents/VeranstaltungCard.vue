<script setup lang="ts">
import Badge from './Badge.vue'

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  veranstaltung: any
  hasUnterveranstaltung?: boolean
}

const { veranstaltung } = defineProps<Props>()
</script>

<template>
  <div
    :key="veranstaltung.id"
    class="rounded-xl p-8 ring-1 ring-gray-200"
  >
    <h2 class="text-lg font-semibold leading-8 text-gray-900">
      {{ veranstaltung.name }}
    </h2>
    <p class="mt-4 text-sm leading-6 text-gray-600">Beschreibung der Veranstaltung</p>
    <p class="mt-6 flex items-baseline gap-x-1">
      <span class="text-4xl font-bold tracking-tight text-gray-900">10</span>
      <span class="text-sm font-semibold leading-6 text-gray-600">/500 Plätzen</span>
    </p>

    <Badge v-if="hasUnterveranstaltung"> Ausschreibung erstellt </Badge>
    <router-link
      v-else
      :to="{
        name: 'UnterveranstaltungCreate',
        params: { veranstaltungId: veranstaltung.id.toString() },
      }"
      class="cursor-pointer mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 text-primary-600 ring-1 ring-inset ring-primary-200 hover:ring-primary-300"
      >Ausschreibung erstellen</router-link
    >

    <ul
      role="list"
      class="mt-8 space-y-3 text-sm leading-6 text-gray-600"
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
