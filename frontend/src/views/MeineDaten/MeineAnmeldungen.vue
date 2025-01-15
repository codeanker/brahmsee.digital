<template>
  <div class="my-4">
    <p class="max-w-2xl text-sm">Hier findest Du alle deine Anmeldungen.</p>

    <AnmeldungenTable
      :veranstaltung-id="1"
    />
  </div>
</template>

<script setup lang="ts">
import AnmeldungenTable from '@/components/data/AnmeldungenTable.vue';
</script>
