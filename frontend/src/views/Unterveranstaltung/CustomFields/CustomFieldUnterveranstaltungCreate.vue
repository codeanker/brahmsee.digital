<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormCreate from '@/components/CustomFields/CustomFieldsFormCreate.vue'
import { paramInt } from '@/helpers/params'

const unterveranstaltungId = computed(() => paramInt('unterveranstaltungId'))
</script>

<template>
  <CustomFieldsFormCreate
    entity="unterveranstaltung"
    :entity-id="unterveranstaltungId"
  />
</template>
