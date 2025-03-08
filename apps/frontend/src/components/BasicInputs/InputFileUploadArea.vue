<script setup lang="ts" generic="Multiple extends boolean">
import { computed, onMounted, ref, shallowRef } from 'vue'

import { formatBytes } from '@codeanker/helpers'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { fromMime, type FileKind } from 'human-filetypes'
import Button from '../UIComponents/Button.vue'

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

  files.value.push(...Array.from<File>(event.dataTransfer.files))
}

const files = ref<File[]>([])

function uploadFileInput(event) {
  files.value.push(...Array.from<File>(event.target.files))
}

function fileUrl(file: File) {
  return URL.createObjectURL(file)
}

async function upload() {
  if (uploadPending.value || !files.value || !files.value[0]) {
    return
  }
  try {
    uploadPending.value = true
    error.value = null
    const result = await handleUpload(files.value, props.multiple, props.maxFileSize)
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

const mimeMap: Record<FileKind, string> = {
  image: 'Bild',
  video: 'Video',
  audio: 'Audio',
  archive: 'Archiv',
  document: 'Dokument',
  spreadsheet: 'Tabelle',
  presentation: 'Präsentation',
  font: 'Schriftart',
  text: 'Text',
  application: 'Ausführbare Datei',
  unknown: 'Unbekanntes Dateiformat',
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
      <slot>
        <div class="flex items-center space-x-4">
          <i class="fad fa-upload fa-2x flex-shrink-0" />
          <h5 class="mb-0">{{ uploadText ?? 'Datei hier hin ziehen oder klicken.' }}</h5>
        </div>
      </slot>

      <input
        ref="fileInput"
        type="file"
        :multiple="multiple"
        :accept="accept"
        :disabled="uploadPending || disabled"
        class="!hidden"
        @change="uploadFileInput"
        @click.stop
      />
    </div>

    <template v-if="files.length > 0">
      <div class="mt-4 flex flex-row gap-x-4 justify-center">
        <template
          v-for="(file, index) in files"
          :key="index"
        >
          <div class="relative">
            <img
              v-if="file.type.startsWith('image')"
              :src="fileUrl(file)"
              class="h-[384px] drop-shadow-lg"
            />
            <div
              class="size-[192px] bg-primary-100 flex flex-col gap-y-2 items-center justify-center rounded border-2 border-primary-200"
            >
              <p>
                <strong>{{ file.name }}</strong>
              </p>
              <p>
                <i>{{ mimeMap[fromMime(file.type)] }}</i>
              </p>
            </div>

            <button
              type="button"
              class="absolute top-2 right-2 bg-white/80 text-red-500 p-2 rounded-full"
              @click="files.splice(index, 1)"
            >
              <TrashIcon class="size-6" />
            </button>
          </div>
        </template>
      </div>
    </template>

    <Button
      class="w-full mt-4"
      :disabled="files.length === 0 || props.disabled"
      @click="upload"
    >
      Hochladen
    </Button>
  </div>
</template>
