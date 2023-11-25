<script setup lang="ts">
import BasicCheckbox from '@/components/BasicCheckbox.vue'
</script>

<template>
  <div>
    <h5>Veranstaltung anlegen</h5>
    <BasicCheckbox
      v-model="checked"
      :label="label"
      :options="options"
      :value="value"
    ></BasicCheckbox>
  </div>
</template>
