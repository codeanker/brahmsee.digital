<script lang="ts" setup>
import { XMarkIcon } from '@heroicons/vue/24/solid'
import BasicInput from './BasicInputs/BasicInput.vue'
import DownloadLink from './DownloadLink.vue'
import Notification from '@/components/LayoutComponents/Notifications.vue'
import { ref } from 'vue'
import { handleUpload } from '@/helpers/handleUpload'
import { useAsyncState } from '@vueuse/core'
import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import { formatTimestamp } from '@codeanker/helpers'
import ConfirmAction from './UIComponents/ConfirmAction.vue'
import MimeTypeIcon from './UIComponents/MimeTypeIcon.vue'
import Loading from './UIComponents/Loading.vue'

type Document = {
  name: string
  fileId: string
  added: boolean
  id?: string
  mimetype: string | null
  createdAt?: Date
}

type UpdateDocument = {
  name: string
  id: string
}

type EntityType = 'unterveranstaltung'

const props = defineProps<{
  entityId: string
  entityType: EntityType
}>()

const documents = ref<Document[]>([])
const deletedDocumentIds = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

const showNotification = ref(false)
const isUploading = ref(false)

const { execute: loadDocuments } = useAsyncState(
  async () => {
    if (props.entityType === 'unterveranstaltung') {
      if (loggedInAccount.value?.role === 'ADMIN') {
        const data = await apiClient.unterveranstaltung.verwaltungGet.query({
          id: props.entityId,
        })
        documents.value = data.documents.map((document) => ({
          name: document.name,
          fileId: document.fileId,
          added: false,
          id: document.id,
          mimetype: document.file.mimetype,
          createdAt: document.file.createdAt,
        }))
      } else {
        const data = await apiClient.unterveranstaltung.gliederungGet.query({
          id: props.entityId,
        })
        documents.value = data.documents.map((document) => ({
          name: document.name,
          fileId: document.fileId,
          added: false,
          id: document.id,
          mimetype: document.file.mimetype,
          createdAt: document.file.createdAt,
        }))
      }
    }
  },
  null,
  { immediate: true }
)

loadDocuments()

const { execute: updateEntity } = useAsyncState(
  async () => {
    const addDocuments = documents.value
      .filter((document) => document.added)
      .map(({ name, fileId }) => ({ name, fileId }))
    const updateDocuments: UpdateDocument[] = documents.value
      .filter((document) => !document.added && document.id !== undefined)
      .map(({ id, name }) => ({ id: id!, name }))

    if (props.entityType === 'unterveranstaltung') {
      if (loggedInAccount.value?.role === 'ADMIN') {
        await apiClient.unterveranstaltung.verwaltungPatch.mutate({
          id: props.entityId,
          data: {
            addDocuments,
            updateDocuments,
            deleteDocumentIds: deletedDocumentIds.value,
          },
        })
      } else {
        if (props.entityType === 'unterveranstaltung') {
          await apiClient.unterveranstaltung.gliederungPatch.mutate({
            id: props.entityId,
            data: {
              addDocuments,
              updateDocuments,
              deleteDocumentIds: deletedDocumentIds.value,
            },
          })
        }
      }
    }
  },
  null,
  { immediate: false }
)

async function onFileChanged($event: Event) {
  isUploading.value = true
  const target = $event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return

  const { id, mimetype } = await handleUpload(file)
  documents.value.push({
    name: file.name,
    fileId: id,
    added: true,
    mimetype,
  })
  if (fileInput.value) fileInput.value.value = ''
  await updateEntity()
  showNotification.value = true
  isUploading.value = false
}

async function deleteDocument(document, index) {
  documents.value.splice(index, 1)
  if (!document.added) {
    deletedDocumentIds.value.push(document.id)
  }
  updateEntity()
  showNotification.value = true
}
</script>

<template>
  <!-- Dokumente ggf. in den Reiter Dokumente verschieben? @ToDo Design stimmt noch nicht -->
  <div class="mt-6 mb-10">
    <div class="text-lg font-semibold">Dokumente</div>
    <p class="text-sm text-gray-500">Lade hier eigene Dokumente hoch</p>
  </div>
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
    <thead class="border-b border-t border-gray-200">
      <tr>
        <th
          width="30px"
          scope="col"
        />
        <th
          scope="col"
          class="px-3 py-3.5 text-left font-semibold"
        >
          Name zur Anzeige
        </th>
        <th
          scope="col"
          width="100px"
          class="hidden md:table-cell"
        >
          Erstellt am
        </th>
        <th
          scope="col"
          width="30px"
        />
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-dark-primary">
      <tr
        v-for="(document, index) in documents"
        :key="'document-' + index"
        class="even:bg-gray-50 dark:even:bg-gray-800"
      >
        <td class="pl-2 pr-1">
          <MimeTypeIcon :mime-type="document.mimetype" />
        </td>
        <td class="whitespace-nowrap py-4 px-3">
          <BasicInput
            :id="'documentName-' + index"
            v-model="document.name"
          />
        </td>

        <td class="text-sm px-3 hidden md:table-cell">
          <span v-if="document.createdAt">{{ formatTimestamp(document.createdAt) }}</span>
        </td>
        <td class="pl-4 pr-3">
          <div class="flex justify-center gap-2">
            <DownloadLink
              label=""
              :file-id="document.fileId"
            />
            <ConfirmAction
              description="Möchtest Du das Dokument wirklich löschen?"
              @confirm="deleteDocument(document, index)"
            >
              <XMarkIcon class="h-5 w-5 text-danger-600 cursor-pointer"
            /></ConfirmAction>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="flex justify-start">
    <div v-if="!isUploading">
      <label
        for="documentFileInput"
        class="input-style w-fit mt-3 cursor-pointer flex items-center"
      >
        <span>Dokument hinzufügen</span>
      </label>
      <input
        id="documentFileInput"
        ref="fileInput"
        type="file"
        capture
        class="hidden"
        accept=".pdf,application/pdf,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xls,application/vnd.ms-excel,.png,image/png,.jpg,image/jpeg,.jpeg,image/jpeg,.zip,application/zip,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        @change="onFileChanged($event)"
      />
    </div>
    <div
      v-else
      class="py-4 text-center"
    >
      <Loading color="primary" />
      Das Dokument wird hochgeladen, bitte warten...
    </div>
  </div>
  <Notification
    v-if="showNotification"
    :duration="2000"
    @close="showNotification = false"
  >
    <template #title> Erfolgreich gespeichert </template>
    <template #content>
      <p class="mt-1 text-sm text-gray-500">Deine Änderungen wurden erfolgreich gespeichert.</p>
    </template>
  </Notification>
</template>
