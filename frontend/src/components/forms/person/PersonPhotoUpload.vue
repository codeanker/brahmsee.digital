<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'
import { handleUpload } from '@/helpers/handleUpload'
import type { Person } from '@codeanker/api'

const props = defineProps<{
  person: Person
}>()

const emit = defineEmits<{
  success: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const { state: photoUrl } = useAsyncState(
  async () => {
    return apiClient.file.fileGetUrl.query({
      id: props.person.photoId,
    })
  },
  null,
  {
    immediate: !!props.person.photoId,
  }
)

async function onFileChanged(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return

  const res = await handleUpload(file)
  await apiClient.person.verwaltungPatch.mutate({
    id: props.person.id,
    data: {
      photoId: res.id,
    },
  })

  emit('success')
}

async function handleFileDelete() {
  await apiClient.person.verwaltungPatch.mutate({
    id: props.person.id,
    data: {
      photoId: null,
    },
  })

  emit('success')
}
</script>

<template>
  <img
    v-if="photoUrl"
    :src="photoUrl"
    class="size-64"
  />
  <p v-else>Noch kein Bild hochgeladen</p>

  <input
    id="personPhotoUpload"
    ref="fileInput"
    type="file"
    capture
    @change="onFileChanged"
  />

  <Button
    color="danger"
    @click="handleFileDelete"
  >
    Bild löschen
  </Button>
</template>
