<script setup lang="ts">
import FormAccountGeneral from '@/components/forms/account/FormAccountGeneral.vue'
</script>

<template>
  <h5>Account erstellen</h5>
  <p>Erstelle einen neuen Account mitsamt Personen-Stammdaten.</p>
  <p>
    Wenn du einen Account für eine existierende Person erstellen möchtest, tu dies bitte über die Detailseite der
    entsprechenden Person.
  </p>

  <div class="mt-10">
    <FormAccountGeneral />
  </div>
</template>
