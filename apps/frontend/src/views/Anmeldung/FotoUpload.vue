<script setup lang="ts">
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import InputFileUploadArea from '@/components/BasicInputs/InputFileUploadArea.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { handleUpload } from '@/helpers/handleUpload'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'

const route = useRoute()

const unterveranstaltung = injectUnterveranstaltung()

const anmeldungId = route.params.anmeldungId as string
const accessToken = route.query.accessToken as string

const { state, execute, error } = useAsyncState(
  () =>
    apiClient.anmeldung.accessTokenValidate.query({
      unterveranstaltungId: unterveranstaltung.value.id,
      anmeldungId: parseInt(anmeldungId),
      accessToken,
    }),
  undefined,
  { immediate: false }
)

watch(unterveranstaltung, (unterveranstaltung) => {
  if (unterveranstaltung) {
    execute()
  }
})

const uploadPending = ref(false)
const uploadSuccess = ref(false)
async function upload(toUploadFile: File) {
  uploadPending.value = true
  try {
    const res = await handleUpload(toUploadFile)
    await apiClient.anmeldung.anmeldungFotoUpload.mutate({
      unterveranstaltungId: unterveranstaltung.value.id,
      anmeldungId: parseInt(anmeldungId),
      accessToken,
      fileId: res.id,
    })
    uploadSuccess.value = true
  } catch (error) {
    console.error(error)
  }
  uploadPending.value = false
}
</script>

<template>
  <div class="container mx-auto grow">
    <p class="text-lg font-bold">Fotoupload</p>

    <template v-if="error">
      <p class="text-lg font-medium">Ein Fehler ist aufgetreten</p>
      <p class="text-red-600 font-medium">
        {{ error }}
      </p>
    </template>
    <template v-else-if="uploadSuccess">
      <p>Das Bild wurde hochgeladen!</p>
    </template>
    <template v-else-if="state === undefined">
      <p>Lade Daten …</p>
      <Loading />
    </template>
    <template v-else-if="state === null">
      Die angegeben Daten konnten nicht verifiziert werden. Wahrscheinlich ist der Zugangstoken falsch!
    </template>
    <template v-else>
      <p>
        Vielen Dank für die Anmeldung von <u>{{ state.person.firstname }} {{ state.person.lastname }}</u> zur
        Veranstaltung <u>{{ state.unterveranstaltung.veranstaltung.name }}</u>
      </p>

      <div class="mb-6 flex justify-between">
        <button
          type="button"
          class="btn btn-link -mr-3 -mt-1 px-3 py-1"
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
          <span>dein Bild wird hochgeladen</span>
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
    </template>
  </div>
</template>
