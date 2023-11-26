<script setup lang="ts">
import InfoList from '@/components/InfoList.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'

const keyInfos = [
  { title: 'Beginn', value: 'Freitag, 26. Mai 2023 16:00 Uhr', small: true },
  { title: 'Ende', value: 'Montag, 29. Mai 2023 14:00 Uhr', small: true },
  { title: 'Veranstaltungsort', value: 'Waldheim am Brahmsee, 24631 Langwedel', small: true },
  { title: 'Teilnahmebeitrag', value: '79€ pro Person' },
  { title: 'Meldeschluss', value: '01.04.2023' },
  { title: 'Zielgruppe', value: '6 -13 Jahre' },
]
</script>

<template>
  <div class="lg:pb-10 lg:px-20 xl:px-28 2xl:px-40">
    <!-- Header -->
    <PublicHeader />
    <div class="text-3xl font-medium mb-5">Ausschreibung Landeskindertreffen</div>
    <div class="mb-5">Wir wollen mit Euch über Pfingsten an den Brahmsee fahren.</div>
    <!-- List -->
    <InfoList :infos="keyInfos" />
    <div class="my-5">
      Weiterer Text zu Bedingungen oder Informationen für die Teilnehmer den ich hier nicht weiter ausführen möchte.
      Deshalb kommt hier jetzt ein Losem ipsum dolor sit amet, onsetetur sadipscing elitr, sed diam nonumy eirmod tempor
      invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
    </div>
    <Button
      color="primary"
      class="w-full justify-center mb-20"
      >Jetzt anmelden</Button
    >
    <div class="flex items-center justify-between">
      <img
        class="h-8"
        src="@/assets/images/gliederung_sh.png"
      />
      <div class="text-sm text-gray-500 text-right">v1.0.0-#123456</div>
    </div>
  </div>
</template>
