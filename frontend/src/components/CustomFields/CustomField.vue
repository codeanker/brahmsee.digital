<script setup lang="ts">
import { type CustomFieldType } from '@codeanker/api'

defineProps<{
  type: CustomFieldType
}>()
</script>

<template>
  {{ type }}
</template>
