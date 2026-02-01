<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormEdit from '@/components/CustomFields/CustomFieldsFormEdit.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const unterveranstaltungId = computed(() => route.params.unterveranstaltungId as string)
const fieldId = computed(() => route.params.fieldId as string)
</script>

<template>
  <CustomFieldsFormEdit
    entity="unterveranstaltung"
    :entity-id="unterveranstaltungId"
    :field-id="fieldId"
  />
</template>
