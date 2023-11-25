<script setup lang="ts">
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'

let model = {
  name: '',
  begin: '',
  ende: '',
  ort: '',
  meldebeginn: '',
  meldeschluss: '',
  maxTeilnehmende: '',
  teilnahmegebuehr: '',
}
</script>

<template>
  <div>
    <h5>Veranstaltung anlegen</h5>
    <BasicInput
      :model-value="model.name"
      label="Name"
      placeholder="Name der Veranstaltung"
    />
    <BasicDatepicker
      :model-value="model.begin"
      label="Beginn"
      placeholder="Veranstaltungsbegin"
    />
    <BasicDatepicker
      :model-value="model.ende"
      label="Ende"
      placeholder="Veranstaltungsende"
    />
    <BasicInput
      :model-value="model.ort"
      label="Ort"
      placeholder="Veranstaltungsort"
    />
    <BasicDatepicker
      :model-value="model.meldebeginn"
      label="Meldebeginn"
      placeholder="Meldebeginn"
    />
    <BasicDatepicker
      :model-value="model.meldeschluss"
      label="Meldeschluss"
      placeholder="Meldeeschluss"
    />
    <BasicDatepicker
      :model-value="model.maxTeilnehmende"
      label="Maximale Teilnehmenden Zahl"
      placeholder="Maximale Teilnehmenden Zahl"
    />
    <BasicInput
      :model-value="model.teilnahmegebuehr"
      label="Teilnahmegebühr"
      placeholder="Teilnahmegebühr"
    />
  </div>
</template>
