<script setup lang="ts">
import FormVeranstaltungGeneral from '@/components/forms/veranstaltung/FormVeranstaltungGeneral.vue'
</script>

<template>
  <h5>Veranstaltung anlegen</h5>
  <div class="grid grid-cols-1 lg:grid-cols-2">
    <FormVeranstaltungGeneral mode="create" />
  </div>
</template>
