<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormEdit from '@/components/CustomFields/CustomFieldsFormEdit.vue'
import { paramInt } from '@/helpers/params'

const unterveranstaltungId = computed(() => paramInt('unterveranstaltungId'))
const fieldId = computed(() => paramInt('fieldId'))
</script>

<template>
  <CustomFieldsFormEdit
    entity="unterveranstaltung"
    :entity-id="unterveranstaltungId"
    :field-id="fieldId"
  />
</template>
