<script setup lang="ts">
import { ChevronLeftIcon, PlusSmallIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import PublicFooter from '@/components/LayoutComponents/PublicFooter.vue'
import PublicHeader from '@/components/LayoutComponents/PublicHeader.vue'
import Button from '@/components/UIComponents/Button.vue'

const test = ref({ name: '', geschlect: '', date: '', boolean1: false })
</script>

<template>
  <div class="lg:py-10 lg:px-20 xl:px-28 2xl:px-40">
    <!-- Header -->
    <PublicHeader />
    <Button
      class="mb-10"
      color="secondary"
      ><ChevronLeftIcon class="h-5 mr-2" />Zurück zur Aussschreibung</Button
    >
    <div class="text-3xl font-medium">Anmeldung</div>
    <div class="mb-5">Zum Landeskindertreffen am Brahmsee 2023</div>
    <!-- Form -->
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="test.name"
        label="Vorname"
        placeholder="Vornamen eingeben"
      />
      <BasicInput
        v-model="test.name"
        label="Nachname"
        placeholder="Nachname eingeben"
      />
      <BasicSelect
        v-model="test.geschlect"
        label="Geschlecht"
        :options="[
          { label: 'Männlich', value: 'm' },
          { label: 'Weiblich', value: 'w' },
          { label: 'Divers', value: 'd' },
        ]"
      />
      <BasicDatepicker
        v-model="test.date"
        label="Geburtsdatum"
        placeholder="Geburtsdatum auswählen"
      />
    </div>
    <hr class="my-5" />
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="test.name"
        label="Straße und Hausnummer"
        placeholder="Straße und Hausnummer eingeben"
      />
      <BasicInput
        v-model="test.name"
        label="Postleitzahl"
        placeholder="Postleitzahl eingeben"
      />
      <BasicInput
        v-model="test.name"
        label="Ort"
        placeholder="Ort eingeben"
      />
    </div>
    <hr class="my-5" />
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="test.name"
        label="E-Mail Adresse"
        placeholder="E-Mail Adresse eingeben"
      />
      <BasicInput
        v-model="test.name"
        label="Mobiltelefonnummer"
        placeholder="Mobiltelefonnummer eingeben"
      />
    </div>
    <hr class="my-5" />
    <div class="font-medium mb-5">Erziehungsberechtigte Person</div>
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        v-model="test.name"
        label="Vorname"
        placeholder="Vorname eingeben"
      />
      <BasicInput
        v-model="test.name"
        label="Nachname"
        placeholder="Nachname eingeben"
      />
      <BasicInput
        v-model="test.name"
        label="Mobiltelefonnummer"
        placeholder="Mobiltelefonnummer eingeben"
      />
      <div />
      <BasicCheckbox
        v-model="test.boolean1"
        label="Ist ein Notfallkontakt"
      />
    </div>
    <hr class="my-5" />
    <div class="font-medium mb-5">Notfallkontakte</div>
    <Button color="secondary"><PlusSmallIcon class="h-5 mr-2" />Notfallkontakt hinzufügen</Button>
    <hr class="my-5" />
    <div class="flex items-start mb-5 space-x-3">
      <BasicCheckbox
        v-model="test.boolean1"
        class="mt-1"
      />
      <div class="font-medium">Ich habe die allgemeinen Teilnahmebedingungen gelesen und akzeptiere diese.</div>
    </div>
    <div class="flex items-start mb-10 space-x-3">
      <BasicCheckbox
        v-model="test.boolean1"
        class="mt-1"
      />
      <div class="font-medium">Ich habe die gesonderten Datenschutzerklärung gelesen und akzeptiere diese.</div>
    </div>
    <Button
      color="primary"
      class="w-full lg:w-auto justify-center mb-20"
      >Anmelden</Button
    >
    <PublicFooter />
  </div>
</template>
