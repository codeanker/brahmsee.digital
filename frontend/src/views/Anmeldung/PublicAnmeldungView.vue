<script setup lang="ts">
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { useRouter } from 'vue-router'
import AnmeldungFormGeneral from './AnmeldungFormGeneral.vue'
import Button from '@/components/UIComponents/Button.vue'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'

const router = useRouter()
const unterveranstaltung = injectUnterveranstaltung()
</script>

<template>
  <Button
    class="mb-10 flex flex-row items-center"
    color="warning"
    @click="router.back()"
  >
    <ChevronLeftIcon class="h-5 mr-2" />
    <span>Abbrechen & Zurück zur Ausschreibung</span>
  </Button>

  <AnmeldungFormGeneral
    :is-public="true"
    :unterveranstaltung-id="unterveranstaltung?.id"
  />
</template>
