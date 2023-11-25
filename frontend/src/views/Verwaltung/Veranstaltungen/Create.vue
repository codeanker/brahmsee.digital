<script setup lang="ts">
import { ref } from 'vue'

import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'

let model = ref({
  name: '',
  begin: '',
  ende: '',
  ort: '',
  meldebeginn: '',
  meldeschluss: '',
  maxTeilnehmende: '',
  teilnahmegebuehr: '',
})
</script>

<template>
  <div>
    <h5>Veranstaltung anlegen</h5>
    <BasicInput
      v-model="model.name"
      label="Name"
      placeholder="Name der Veranstaltung"
    />
    <BasicDatepicker
      v-model="model.begin"
      format="dd.MM.yyyy"
      label="Beginn"
      placeholder="Veranstaltungsbegin"
    />
    <BasicDatepicker
      v-model="model.ende"
      format="dd.MM.yyyy"
      label="Ende"
      placeholder="Veranstaltungsende"
    />
    <BasicInput
      v-model="model.ort"
      label="Ort"
      placeholder="Veranstaltungsort"
    />
    <BasicDatepicker
      v-model="model.meldebeginn"
      format="dd.MM.yyyy"
      label="Meldebeginn"
      placeholder="Meldebeginn"
    />
    <BasicDatepicker
      v-model="model.meldeschluss"
      format="dd.MM.yyyy"
      label="Meldeschluss"
      placeholder="Meldeeschluss"
    />
    <BasicDatepicker
      v-model="model.maxTeilnehmende"
      format="dd.MM.yyyy"
      label="Maximale Teilnehmenden Zahl"
      placeholder="Maximale Teilnehmenden Zahl"
    />
    <BasicInput
      v-model="model.teilnahmegebuehr"
      label="Teilnahmegebühr"
      placeholder="Teilnahmegebühr"
    />
  </div>
</template>
