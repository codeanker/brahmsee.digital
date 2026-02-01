<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormCreate from '@/components/CustomFields/CustomFieldsFormCreate.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const veranstaltungId = computed(() => route.params.veranstaltungId as string)
</script>

<template>
  <CustomFieldsFormCreate
    entity="veranstaltung"
    :entity-id="veranstaltungId"
  />
</template>
