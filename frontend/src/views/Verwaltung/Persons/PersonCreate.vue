<script setup lang="ts">
import FormPersonGeneral from '@/components/forms/person/FormPersonGeneral.vue'
import router from '@/router'
</script>

<template>
  <h5>Person erstellen</h5>
  <div class="mt-10">
    <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
    <FormPersonGeneral @update="() => router.back()" />
  </div>
</template>
