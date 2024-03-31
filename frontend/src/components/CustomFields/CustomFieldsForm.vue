<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customFieldValues: Record<number, any>
  entityId?: number
  entity: 'veranstaltung' | 'unterveranstaltung'
}>()

const { state: customFields } = useAsyncState(async () => {
  return apiClient.customFields.list.query({
    entity: props.entity,
    entityId: props.entityId,
  })
}, undefined)
</script>

<template>
  <div>
    <pre>
    {{ customFields }}
    </pre>
  </div>
  <!-- <div
    v-if="customFieldValues?.length > 0"
    class="grid grid-cols-2"
  >
    <pre>{{ props.customFieldValues }}</pre>
  </div> -->

  <!-- <div
    v-if="(customFieldValues?.length ?? 0) > 0"
    class="grid grid-cols-2"
  >
    <template
      v-for="customFieldValue in currentAnmeldung?.customFieldValues"
      :key="customFieldValue.id"
    >
      <div class="flex flex-col gap-y-2">

        <CustomField
          v-model="customFieldValues[customFieldValue.field.id]"
          :field="customFieldValue.field"
        />

        <p class="text-sm text-gray-500">{{ customFieldValue.field.description }}</p>
      </div>
    </template>
  </div>
  <hr
    v-if="(currentAnmeldung?.customFieldValues?.length ?? 0) > 0"
    class="my-5"
  /> -->
</template>
