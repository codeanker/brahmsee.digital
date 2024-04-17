<!-- eslint-disable no-console -->
<script setup lang="ts">
import { ref } from 'vue'

import { handleUpload } from '@/helpers/handleUpload'

// const { state: fileList } = useAsyncState(async () => {
//   // return apiClient.
//   apiClient.file.List.query({ filter: {}, pagination: { take: 100, skip: 0 } })
//   // return apiClient.gliederung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
// }, [])

// await fetch('http://localhost:3030/upload/file/1', {
//   method: 'POST',
//   body: 'foo',
// })

const file = ref<File | null>()

async function onFileChanged($event: Event) {
  const target = $event.target as HTMLInputElement
  if (target && target.files) {
    file.value = target.files[0]
  }
  try {
    const dbFile = await handleUpload(file.value as File)
    console.log({ dbFile })
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <div>
    <input
      type="file"
      capture
      @change="onFileChanged($event)"
    />
  </div>
</template>
