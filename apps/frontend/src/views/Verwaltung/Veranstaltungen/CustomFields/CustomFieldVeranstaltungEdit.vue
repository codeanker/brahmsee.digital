<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormEdit from '@/components/CustomFields/CustomFieldsFormEdit.vue'
import { paramInt } from '@/helpers/params'

const veranstaltungId = computed(() => paramInt('veranstaltungId'))
const fieldId = computed(() => paramInt('fieldId'))
</script>

<template>
  <CustomFieldsFormEdit
    entity="veranstaltung"
    :entity-id="veranstaltungId"
    :field-id="fieldId"
  />
</template>
