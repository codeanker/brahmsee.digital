<script setup lang="ts">
import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'

const createDemoVeranstaltung = async () => {
  await apiClient.veranstaltung.verwaltungCreate.mutate({
    data: {
      name: 'Brahmsee 2024',
      beginn: new Date('2024-05-26'),
      ende: new Date('2024-05-29'),
      ort: 'Waldheim am Brahmsee, 24631 Langwedel',
      meldebeginn: new Date('2024-01-01'),
      meldeschluss: new Date('2024-04-01'),
      maxTeilnehmende: 500,
      teilnahmegebuehr: 79,
    },
  })
}

const createDemoUnterveranstaltung = async () => {
  await apiClient.unterveranstaltung.verwaltungCreate.mutate({
    data: {
      veranstaltungId: 1,
      maxTeilnehmende: 100,
      teilnahmegebuehr: 50,
      meldebeginn: new Date('2024-01-01'),
      meldeschluss: new Date('2024-04-01'),
      gliederungId: 607,
      beschreibung:
        'Weiterer Text zu Bedingungen oder Informationen für die Teilnehmer den ich hier nicht weiter ausführen möchte. Deshalb kommt hier jetzt ein Losem ipsum dolor sit amet, onsetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      type: 'GLIEDERUNG',
    },
  })
}
</script>

<template>
  <div class="dashboard">
    <h3>Welcome to the Dashboard!</h3>
    <div class="flex space-x-3">
      <Button
        color="primary"
        @click="createDemoVeranstaltung"
      >
        Create Demo Veranstaltung
      </Button>
      <Button
        color="primary"
        @click="createDemoUnterveranstaltung"
      >
        Create Demo Unterveranstaltung
      </Button>
    </div>
  </div>
</template>
