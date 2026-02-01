<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormCreate from '@/components/CustomFields/CustomFieldsFormCreate.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const unterveranstaltungId = computed(() => route.params.unterveranstaltungId as string)
</script>

<template>
  <CustomFieldsFormCreate
    entity="unterveranstaltung"
    :entity-id="unterveranstaltungId"
  />
</template>
