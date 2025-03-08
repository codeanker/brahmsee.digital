<script setup lang="ts">
const version = `${import.meta.env.VITE_APP_VERSION || 'unknown'}-${import.meta.env.VITE_APP_COMMIT_HASH || 'unknown'}`
</script>

<template>
  {{ version }}
</template>
