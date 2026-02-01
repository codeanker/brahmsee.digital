<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormEdit from '@/components/CustomFields/CustomFieldsFormEdit.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const veranstaltungId = computed(() => route.params.veranstaltungId as string)
const fieldId = computed(() => route.params.fieldId as string)
</script>

<template>
  <CustomFieldsFormEdit
    entity="veranstaltung"
    :entity-id="veranstaltungId"
    :field-id="fieldId"
  />
</template>
