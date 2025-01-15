<script setup lang="ts">
import { inject, ref } from 'vue'

import InputFileUploadArea from '../BasicInputs/InputFileUploadArea.vue'
import Button from './Button.vue'

import Modal from './Modal.vue'
import { apiClient } from '@/api'
import { handleUpload } from '@/helpers/handleUpload'

const props = defineProps<{
  personId: number
}>()

const modal = ref<InstanceType<typeof Modal>>()

const open = () => {
  console.log('open')
  if (modal.value) {
    modal.value.show()
  }
}

const close = () => {
  console.log('close')
  if (modal.value) {
    modal.value.hide()
  }
}

const uploadPending = ref(false)
async function upload(toUploadFile: File) {
  console.log('upload')
  uploadPending.value = true
  try {
    const res = await handleUpload(toUploadFile)
    await apiClient.person.verwaltungPatch.mutate({
      id: props.personId,
      data: {
        photoId: res.id,
      },
    })
    close()
  } catch (error) {
    console.error(error)
  }
  uploadPending.value = false
}

async function remove() {
  console.log('remove')
  uploadPending.value = true
  try {
    await apiClient.person.verwaltungPatch.mutate({
      id: props.personId,
      data: {
        photoId: null,
      },
    })
    close()
  } catch (error) {
    console.error(error)
  }
  uploadPending.value = false
}

defineExpose({ open, close })
</script>

<template>
  <Modal ref="modal">
    <template #content>
      <div class="mb-6 flex justify-between">
        <h4 class="mb-0">Bild auswählen</h4>
        <button
          type="button"
          class="btn btn-link -mr-3 -mt-1 px-3 py-1"
          @click="close"
        >
          <i class="fas fa-times" />
        </button>
      </div>
      <div class="flex w-full justify-center">
        <!-- <FontAwesomeIcon
          v-if="uploadPending"
          :icon="faSpinner"
          size="2x"
          spin
        /> -->
        <InputFileUploadArea
          accept="image/*"
          :multiple="false"
          upload-text="Bild hier hin ziehen oder klicken."
          class="w-full"
          @uploaded="upload"
        />
      </div>
      <div class="mt-6 grid gap-4">
        <Button
          type="button"
          color="danger"
          class="w-full"
          @click="remove"
        >
          Bild entfernen
        </Button>
      </div>
    </template>
  </Modal>
</template>
