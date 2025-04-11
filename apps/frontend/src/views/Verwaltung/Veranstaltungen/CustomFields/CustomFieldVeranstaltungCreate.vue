<script setup lang="ts">
import { computed } from 'vue'

import CustomFieldsFormCreate from '@/components/CustomFields/CustomFieldsFormCreate.vue'
import { paramInt } from '@/helpers/params'

const veranstaltungId = computed(() => paramInt('veranstaltungId'))
</script>

<template>
  <CustomFieldsFormCreate
    entity="veranstaltung"
    :entity-id="veranstaltungId"
  />
</template>
