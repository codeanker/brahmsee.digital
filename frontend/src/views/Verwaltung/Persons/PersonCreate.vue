<script setup lang="ts">
import FormPersonGeneral from '@/components/forms/person/FormPersonGeneral.vue'
</script>

<template>
  <h5>Benutzer erstellen</h5>
  <div class="mt-10">
    <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
    <FormPersonGeneral mode="create" />
  </div>
</template>
