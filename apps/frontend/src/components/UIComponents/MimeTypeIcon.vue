<script lang="ts" setup>
import fileCSV from '@/assets/images/icons/Files/file-csv-duotone-solid.svg'
import fileDoc from '@/assets/images/icons/Files/file-doc-duotone-solid.svg'
import fileJPG from '@/assets/images/icons/Files/file-jpg-duotone-solid.svg'
import filePDF from '@/assets/images/icons/Files/file-pdf-duotone-solid.svg'
import filePNG from '@/assets/images/icons/Files/file-png-duotone-solid.svg'
import filePPT from '@/assets/images/icons/Files/file-ppt-duotone-solid.svg'
import fileXLS from '@/assets/images/icons/Files/file-xls-duotone-solid.svg'
import fileZIP from '@/assets/images/icons/Files/file-zip-duotone-solid.svg'
import file from '@/assets/images/icons/Files/file-duotone-solid.svg'
defineProps<{
  mimeType?: string | null
}>()

const mimeIconMap = {
  'text/csv': fileCSV,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': fileDoc,
  'application/msword': fileDoc,
  'image/jpeg': fileJPG,
  'application/pdf': filePDF,
  'image/png': filePNG,
  'application/vnd.ms-powerpoint': filePPT,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': filePPT,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': fileXLS,
  'application/vnd.ms-excel': fileXLS,
  'application/zip': fileZIP,
}

function iconClass(mimeType?: string | null) {
  if (!mimeType) return file // Schwarze Farbe als Standard
  return mimeIconMap[mimeType] || file
}
</script>

<template>
  <img
    :src="iconClass(mimeType)"
    class="h-8 w-8"
  />
</template>
