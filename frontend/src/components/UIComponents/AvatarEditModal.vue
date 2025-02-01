<script setup lang="ts">
import { ref } from 'vue'

import InputFileUploadArea from '../BasicInputs/InputFileUploadArea.vue'
import Button from './Button.vue'
import Loading from '../UIComponents/Loading.vue'

import Modal from './Modal.vue'
import { apiClient } from '@/api'
import { handleUpload } from '@/helpers/handleUpload'

const props = defineProps<{
  personId: number
  showRemove?: boolean
}>()

const emit = defineEmits<{
  triggerRefresh: []
  deleted: []
  uploaded: [photoId: string]
}>()

const modal = ref<InstanceType<typeof Modal>>()

const open = () => {
  if (modal.value) {
    modal.value.show()
  }
}

const close = () => {
  if (modal.value) {
    modal.value.hide()
    emit('triggerRefresh')
  }
}

const uploadPending = ref(false)
async function upload(toUploadFile: File) {
  uploadPending.value = true
  try {
    const res = await handleUpload(toUploadFile)
    await apiClient.person.verwaltungPatch.mutate({
      id: props.personId,
      data: {
        photoId: res.id,
      },
    })
    console.log('ressss', res.id)
    emit('uploaded', res.id)
    close()
  } catch (error) {
    console.error(error)
  }
  uploadPending.value = false
}

async function remove() {
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
  <Teleport to="body">
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
          <div
            v-if="uploadPending"
            class="flex flex-col text-justify-center items-center"
          >
            <Loading size="md" />
            dein Bild wird hochgeladen
          </div>
          <InputFileUploadArea
            v-else
            accept="image/*"
            :multiple="false"
            upload-text="Bild hier hin ziehen oder klicken."
            class="w-full"
            @uploaded="upload"
          />
        </div>
        <div class="mt-6 grid gap-4">
          <Button
            v-if="showRemove"
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
  </Teleport>
</template>
