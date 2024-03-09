<script setup lang="ts">
import { ref } from 'vue'

import CustomFieldsForm, { type ICustomFieldData } from '@/components/forms/customFields/CustomFieldsForm.vue'
import { ValidateForm } from '@codeanker/validation'

const form = ref<ICustomFieldData>({
  name: '',
  description: '',
  required: false,
  type: 'TEXT',
})
</script>

<template>
  <h5>Benutzerdefiniertes Feld erstellen</h5>

  <ValidateForm>
    <CustomFieldsForm v-model="form" />
  </ValidateForm>
</template>
