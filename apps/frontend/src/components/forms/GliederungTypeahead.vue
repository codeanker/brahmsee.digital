<script setup lang="ts">
import { apiClient } from '@/api'
import BasicTypeahead from '../BasicInputs/BasicTypeahead.vue'

const props = defineProps<{
  required?: boolean
}>()

async function queryObjectGliederungen(searchTerm) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}

const model = defineModel<Record<string, any>>()
</script>

<template>
  <BasicTypeahead
    v-model="model"
    :query="queryObjectGliederungen"
    :input-formatter="(result) => result?.name"
    :result-formatter="(result) => result.name"
    :strict="true"
    label="Gliederung"
    :required="props.required"
    placeholder="Gliederung eingeben"
  />
</template>
