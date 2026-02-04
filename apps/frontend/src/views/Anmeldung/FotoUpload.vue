<script setup lang="ts">
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import InputFileUploadArea from '@/components/BasicInputs/InputFileUploadArea.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { handlePublicPhotoUpload } from '@/helpers/handleUpload'
import { injectUnterveranstaltung } from '@/layouts/AnmeldungLayout.vue'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, useTemplateRef, watch } from 'vue'
import { dayjs } from '@codeanker/helpers'
import cn from '@/helpers/cn'

const route = useRoute()

const uploader = useTemplateRef('uploader')

const unterveranstaltung = injectUnterveranstaltung()

const meldeschlussErreicht = computed(() => dayjs().isAfter(unterveranstaltung.value.meldeschluss))

const anmeldungId = route.params.anmeldungId as string
const accessToken = route.query.accessToken as string

const { state, execute, error } = useAsyncState(
  () =>
    apiClient.anmeldung.accessTokenValidate.query({
      unterveranstaltungId: unterveranstaltung.value.id,
      anmeldungId,
      accessToken,
    }),
  undefined,
  { immediate: false }
)

const { state: currentPhotoUrl, execute: loadPhoto } = useAsyncState(
  async () => {
    if (!state.value?.person.photoId) {
      return null
    }
    return await apiClient.file.fileGetUrl.query({ id: state.value.person.photoId })
  },
  null,
  { immediate: false }
)

watch(unterveranstaltung, (unterveranstaltung) => {
  if (unterveranstaltung) {
    execute()
  }
})

watch(state, (state) => {
  if (state?.person.photoId) {
    loadPhoto()
  }
})

const uploadPending = ref(false)
const uploadSuccess = ref(false)
const uploadError = ref<Error>()
async function upload(toUploadFile: File) {
  uploadPending.value = true
  try {
    const res = await handlePublicPhotoUpload(toUploadFile, {
      unterveranstaltungId: unterveranstaltung.value.id,
      anmeldungId,
      accessToken,
    })
    await apiClient.anmeldung.anmeldungFotoUpload.mutate({
      unterveranstaltungId: unterveranstaltung.value.id,
      anmeldungId,
      accessToken,
      fileId: res.id,
    })
    await execute()
    await loadPhoto()
    uploadSuccess.value = true
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      uploadError.value = error
    }
  }
  uploadPending.value = false
}
</script>

<template>
  <div class="container mx-auto grow">
    <template v-if="error">
      <p class="text-lg font-medium">Ein Fehler ist aufgetreten</p>
      <p class="text-red-600 font-medium">
        {{ error }}
      </p>
    </template>
    <template v-else-if="state === undefined">
      <p>Lade Daten …</p>
      <Loading />
    </template>
    <template v-else-if="state === null">
      Die angegeben Daten konnten nicht verifiziert werden. Wahrscheinlich ist der Zugangstoken falsch!
    </template>
    <div
      v-else
      class="flex flex-col gap-y-12 md:flex-row md:gap-x-12 lg:gap-x-24"
    >
      <div class="grow">
        <p class="text-lg font-bold">Fotoupload</p>
        <p>
          Vielen Dank für die Anmeldung von <u>{{ state.person.firstname }} {{ state.person.lastname }}</u> zur
          Veranstaltung <u>{{ state.unterveranstaltung.veranstaltung.name }}</u
          >.
        </p>

        <template v-if="meldeschlussErreicht">
          <p class="text-red-500">Leider ist der Meldeschluss bereits erreicht.</p>
        </template>
        <template v-else>
          <p>
            Lade hier ein Bild von <u>{{ state.person.firstname }} {{ state.person.lastname }}</u> hoch. Dieses wird
            dann bspw. für Teilnehmendenausweise verwendet.
          </p>
          <p>
            <strong>Wichtig:</strong> Bitte achte darauf, dass das Foto möglichst quadratisch ist (gleiche Höhe wie
            Breite).
          </p>

          <div
            v-if="uploadPending"
            class="flex flex-col text-justify-center items-center"
          >
            <Loading size="md" />
            <span>dein Bild wird hochgeladen</span>
          </div>
          <div v-else-if="uploadError">
            <p class="text-red-500">{{ uploadError.message }}</p>
          </div>
          <template v-else-if="uploadSuccess">
            <p class="text-primary-500">Das Bild wurde hochgeladen!</p>
          </template>

          <div class="mb-6 flex justify-between">
            <button
              type="button"
              class="btn btn-link -mr-3 -mt-1 px-3 py-1"
            >
              <i class="fas fa-times" />
            </button>
          </div>

          <InputFileUploadArea
            ref="uploader"
            accept="image/*"
            :multiple="false"
            :disabled="uploadPending"
            upload-text="Bild hier hin ziehen oder klicken."
            class="w-full"
            :on-upload="upload"
          />
        </template>
      </div>
      <div
        v-if="currentPhotoUrl"
        :class="cn({ 'shake opacity-50': uploader?.files.length ?? 0 > 0 })"
      >
        <p class="text-md font-medium">Aktuelles Foto</p>
        <img
          :src="currentPhotoUrl"
          class="h-[384px] object-contain object-top drop-shadow-2xl"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.shake {
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0% {
    transform: rotate(0);
    transform-origin: center;
  }
  20% {
    transform: rotate(-0.5deg);
    transform-origin: center;
  }
  40% {
    transform: rotate(0.5deg);
    transform-origin: center;
  }
  60% {
    transform: rotate(-0.5deg);
    transform-origin: center;
  }
  80% {
    transform: rotate(0.5deg);
    transform-origin: center;
  }
  100% {
    transform: rotate(0);
    transform-origin: center;
  }
}
</style>
