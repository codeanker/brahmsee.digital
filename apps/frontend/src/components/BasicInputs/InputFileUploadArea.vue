<script setup lang="ts" generic="Multiple extends boolean">
import { computed, onMounted, ref, shallowRef } from 'vue'

import { formatBytes } from '@codeanker/helpers'

const props = defineProps<{
  multiple?: Multiple
  accept?: string
  disabled?: boolean
  maxFileSize?: number
  fullWindowDropzone?: boolean
  uploadText?: string
}>()

const emit = defineEmits<{
  uploaded: [Multiple extends true ? File[] : File]
}>()

const InputFileUploadAreaConf = {
  notDraggedOver: 'bg-gray-100',
  draggedOver: 'bg-primary-100',
}

const fileInput = shallowRef<HTMLInputElement>()
const dropZone = ref<HTMLElement>()

const uploadPending = ref(false)
const error = ref()
const dragCounter = ref(0)

const isDraggedOver = computed(() => dragCounter.value > 0)

onMounted(() => {
  const target = props.fullWindowDropzone ? window : dropZone.value
  if (!target) {
    return
  }
  target.addEventListener('dragenter', dropZoneDragEnter)
  target.addEventListener('dragleave', dropZoneDragLeave)
  target.addEventListener('dragover', dropZoneDragOver)
  target.addEventListener('drop', dropZoneDrop)
})

function dropZoneDragEnter(event) {
  event.preventDefault()
  event.stopPropagation()
  dragCounter.value++
}

function dropZoneDragOver(event) {
  event.preventDefault()
}

function dropZoneDragLeave(event) {
  event.preventDefault()
  event.stopPropagation()
  dragCounter.value--
}

function dropZoneDrop(event) {
  event.preventDefault()
  event.stopPropagation()
  dragCounter.value = 0
  return upload(event.dataTransfer.files)
}

function uploadFileInput(event) {
  return upload(event.target.files)
}

async function upload(files) {
  if (uploadPending.value || !files || !files[0]) {
    return
  }
  try {
    uploadPending.value = true
    error.value = null
    const result = await handleUpload(files, props.multiple, props.maxFileSize)
    emit('uploaded', result)
  } catch (uploadError: any) {
    if (uploadError.message === 'file size too large' && props.maxFileSize) {
      error.value = `Die Dateigröße muss kleiner als ${formatBytes(props.maxFileSize)} sein`
    } else {
      console.error(error)
    }
  } finally {
    // reset fileInput
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    uploadPending.value = false
  }
}

async function handleUpload(uploadFiles, multiple = false, maxFileSize) {
  if (multiple) {
    const toUploadFiles: any[] = []
    for (const key in uploadFiles) {
      if (typeof uploadFiles[key] === 'object') {
        toUploadFiles.push(uploadFiles[key])
      }
    }
    const files = await Promise.all(
      toUploadFiles.map(async (toUploadFile) => {
        validateFile(toUploadFile, maxFileSize)
        return toUploadFile
      })
    )
    return files
  } else {
    const toUploadFile = uploadFiles[0]
    validateFile(toUploadFile, maxFileSize)
    return toUploadFile
  }

  function validateFile(toUploadFile, maxFileSize) {
    if (maxFileSize && maxFileSize < toUploadFile.size) {
      throw new Error('file size too large')
    }
  }
}
</script>

<template>
  <div ref="dropZone">
    <div
      class="border-primary text-primary flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-6 transition-colors"
      :class="{
        [InputFileUploadAreaConf.notDraggedOver]: !isDraggedOver,
        [InputFileUploadAreaConf.draggedOver]: isDraggedOver,
      }"
      @click="fileInput?.click()"
    >
      <div>
        <slot>
          <div class="flex items-center space-x-4">
            <i class="fad fa-upload fa-2x flex-shrink-0" />
            <h5 class="mb-0">{{ uploadText ?? 'Datei hier hin ziehen oder klicken.' }}</h5>
          </div>
        </slot>
      </div>
      <input
        id="hidden-input"
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        :disabled="uploadPending || disabled"
        class="hidden"
        @change="uploadFileInput"
        @click.stop
      />
    </div>
  </div>
</template>
