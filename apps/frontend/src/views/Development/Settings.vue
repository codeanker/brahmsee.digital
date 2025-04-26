<script setup lang="ts">
import Button from '@/components/UIComponents/Button.vue'
</script>

<template>
  <div class="max-w-2xl lg:mx-0 mb-6">
    <h2 class="text-2xl font-bold tracking-tight sm:text-4xl">Einstellungen</h2>
    <p class="text-md">Sammlung von Entwickler-Einstellungen</p>
  </div>
  <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-8">
    <div>
      <div class="text-md font-semibold">Meilisearch Syncronisation</div>
      <p class="text-sm text-gray-500">Führt eine komplette Syncronisation mit Meilisearch durch</p>
    </div>
    <div class="md:col-span-2">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="col-span-full">
          <Button
            variant="primary"
            @click="() => syncMeilisearch()"
          >
            Meilisearch Syncronisation
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
