<script setup lang="ts">
import UnterveranstaltungenTable from '@/components/UnterveranstaltungenTable.vue'
</script>

<template>
  <div>
    <h5>Ausschreibungen</h5>
    <div class="flow-root">
      <p class="mt-8 text-sm">
        <b>Tipp</b>: Zum Bearbeiten einer Ausschreibung die entsprechmeldeschluss Zeile anklicken.
      </p>
      <RouterLink
        class="text-primary-600"
        :to="{ name: 'UnterveranstaltungCreate' }"
        >Ausschreibung erstellen</RouterLink
      >

      <UnterveranstaltungenTable :columns="['veranstaltung']" />
    </div>
  </div>
</template>
