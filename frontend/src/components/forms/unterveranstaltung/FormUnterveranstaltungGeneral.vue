<script setup lang="ts">
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicInputNumber from '@/components/BasicInputs/BasicInputNumber.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import DownloadLink from '@/components/DownloadLink.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { handleUpload } from '@/helpers/handleUpload'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { UnterveranstaltungTypeMapping, getEnumOptions } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import UnterveranstaltungLandingSettings, { type ILandingSettings } from './UnterveranstaltungLandingSettings.vue'

const props = defineProps<{
  unterveranstaltung?: any
  veranstaltungId?: any
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const unterveranstaltungId = props.unterveranstaltung?.id
const gliederung = ref(props.unterveranstaltung?.gliederung)
const documents = ref(props.unterveranstaltung?.documents || [])
const deletedDocumentIds = ref<number[]>([])

const unterveranstaltungCopy = ref({
  beschreibung: props.unterveranstaltung?.beschreibung,
  bedingungen: props.unterveranstaltung?.bedingungen,
  maxTeilnehmende: props.unterveranstaltung?.maxTeilnehmende,
  meldebeginn: props.unterveranstaltung?.meldebeginn,
  meldeschluss: props.unterveranstaltung?.meldeschluss,
  teilnahmegebuehr: props.unterveranstaltung?.teilnahmegebuehr,
  veranstaltungId: props.unterveranstaltung?.veranstaltung?.id,
  gliederungId: props.unterveranstaltung?.gliederung?.id,
  type: props.unterveranstaltung?.type,
})

const landingSettings = ref<ILandingSettings>({
  heroTitle: props.unterveranstaltung?.landingSettings?.heroTitle,
  heroSubtitle: props.unterveranstaltung?.landingSettings?.heroSubtitle,
  eventDetailsTitle: props.unterveranstaltung?.landingSettings?.eventDetailsTitle,
  eventDetailsContent: props.unterveranstaltung?.landingSettings?.eventDetailsContent,
  miscellaneousVisible: props.unterveranstaltung?.landingSettings?.miscellaneousVisible,
  miscellaneousTitle: props.unterveranstaltung?.landingSettings?.miscellaneousTitle,
  miscellaneousSubtitle: props.unterveranstaltung?.landingSettings?.miscellaneousSubtitle,
  faqVisible: props.unterveranstaltung?.landingSettings?.faqVisible,
  faqEmail: props.unterveranstaltung?.landingSettings?.faqEmail,
  instagramVisible: props.unterveranstaltung?.landingSettings?.instagramVisible,
  instagramUrl: props.unterveranstaltung?.landingSettings?.instagramUrl,
  facebookVisible: props.unterveranstaltung?.landingSettings?.facebookVisible,
  facebookUrl: props.unterveranstaltung?.landingSettings?.facebookUrl,
})

// Wird benötig damit man direkt von einer Veranstaltung eine Unterveranstaltung anlegen kann ohne diese extra auswählen zu müssen
if (props.mode === 'create') {
  unterveranstaltungCopy.value.veranstaltungId = props?.veranstaltungId
}

function useVeranstaltungList(isAdmin: boolean) {
  if (isAdmin) {
    const { state } = useAsyncState(async () => {
      return apiClient.veranstaltung.verwaltungList.query({
        filter: {},
        orderBy: [],
        pagination: { take: 100, skip: 0 },
      })
    }, [])
    return state
  } else {
    const { state } = useAsyncState(async () => {
      return apiClient.veranstaltung.gliederungList.query({
        filter: {},
        orderBy: [],
        pagination: { take: 100, skip: 0 },
      })
    }, [])
    return state
  }
}

const veranstaltungen = useVeranstaltungList(loggedInAccount.value?.role === 'ADMIN')

const {
  execute: createUnterveranstaltung,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    if (loggedInAccount.value?.role === 'ADMIN') {
      unterveranstaltungCopy.value.gliederungId = gliederung.value.id
      await apiClient.unterveranstaltung.verwaltungCreate.mutate({
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['verwaltungCreate']['data'],
        landingSettings:
          landingSettings.value as unknown as RouterInput['unterveranstaltung']['verwaltungCreate']['landingSettings'],
      })
    } else {
      delete unterveranstaltungCopy.value.gliederungId
      delete unterveranstaltungCopy.value.type
      await apiClient.unterveranstaltung.gliederungCreate.mutate({
        data: unterveranstaltungCopy.value as unknown as RouterInput['unterveranstaltung']['gliederungCreate']['data'],
        landingSettings:
          landingSettings.value as unknown as RouterInput['unterveranstaltung']['gliederungCreate']['landingSettings'],
      })
    }
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateUnterveranstaltung,
  error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    const addDocuments = documents.value
      .filter((document) => document.added)
      .map(({ name, fileId }) => ({ name, fileId }))
    const updateDocuments = documents.value.filter((document) => !document.added).map(({ id, name }) => ({ id, name }))

    if (loggedInAccount.value?.role === 'ADMIN') {
      delete unterveranstaltungCopy.value.gliederungId
      delete unterveranstaltungCopy.value.veranstaltungId
      delete unterveranstaltungCopy.value.type
      if (unterveranstaltungCopy.value.bedingungen === null) {
        delete unterveranstaltungCopy.value.bedingungen
      }
      await apiClient.unterveranstaltung.verwaltungPatch.mutate({
        id: unterveranstaltungId,
        data: {
          ...unterveranstaltungCopy.value,
          addDocuments,
          updateDocuments,
          deleteDocumentIds: deletedDocumentIds.value,
        } as RouterInput['unterveranstaltung']['verwaltungPatch']['data'],
        landingSettings: landingSettings.value,
      })
    } else {
      delete unterveranstaltungCopy.value.gliederungId
      delete unterveranstaltungCopy.value.veranstaltungId
      delete unterveranstaltungCopy.value.type
      if (unterveranstaltungCopy.value.bedingungen === null) {
        delete unterveranstaltungCopy.value.bedingungen
      }
      await apiClient.unterveranstaltung.gliederungPatch.mutate({
        id: unterveranstaltungId,
        data: {
          ...unterveranstaltungCopy.value,
          addDocuments,
          updateDocuments,
          deleteDocumentIds: deletedDocumentIds.value,
        } as RouterInput['unterveranstaltung']['gliederungPatch']['data'],
        landingSettings: landingSettings.value,
      })
    }

    props.onUpdate?.()
    router.back()
  },
  null,
  { immediate: false }
)

const handle = async () => {
  switch (props.mode) {
    case 'create':
      await createUnterveranstaltung()
      break
    case 'update':
      await updateUnterveranstaltung()
      break
  }
}

async function queryObjectGliederungen(searchTerm) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}

const veranstaltung = computed(() => {
  if (props.mode === 'create') {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    unterveranstaltungCopy.value.meldebeginn = undefined
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    unterveranstaltungCopy.value.meldeschluss = undefined

    return veranstaltungen.value.find((item) => item.id == unterveranstaltungCopy.value.veranstaltungId)
  } else {
    return props.unterveranstaltung?.veranstaltung
  }
})

const disableddates = computed(() => {
  const obj = {
    to: undefined,
    from: undefined,
  }
  if (veranstaltung.value) {
    obj.to = veranstaltung.value.meldebeginn
    obj.from = veranstaltung.value.meldeschluss
  }
  return obj
})

const fileInput = ref<HTMLInputElement | null>(null)

async function onFileChanged($event: Event) {
  const target = $event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return

  const { id } = await handleUpload(file)
  documents.value.push({
    name: file.name,
    fileId: id,
    added: true,
  })
  if (fileInput.value) fileInput.value.value = ''
}

function deleteDocument(document, index) {
  documents.value.splice(index, 1)
  if (!document.added) {
    deletedDocumentIds.value.push(document.id)
  }
}
</script>

<template>
  <ValidateForm @submit="handle">
    <div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
      <div class="lg:col-span-full">
        <div class="text-lg font-semibold">Ausschreibung</div>
        <p class="max-w-2xl text-sm">Bearbeite hier die Stammdaten der Ausschreibung</p>
      </div>
      <div
        v-if="mode === 'create'"
        class="lg:col-span-full"
      >
        <BasicSelect
          v-model="unterveranstaltungCopy.veranstaltungId"
          required
          label="Veranstaltung"
          placeholder="Veranstaltungsort"
          :options="veranstaltungen.map((veranstaltung) => ({ label: veranstaltung.name, value: veranstaltung.id }))"
        />
      </div>
      <template v-if="mode === 'create' && loggedInAccount?.role === 'ADMIN'">
        <div class="lg:col-span-3">
          <BasicTypeahead
            v-model="gliederung"
            :query="queryObjectGliederungen"
            :input-formatter="(result) => result?.name"
            :result-formatter="(result) => result.name"
            :strict="true"
            label="Gliederung"
            required
            placeholder="Gliederung eingeben"
          />
        </div>
        <div class="lg:col-span-3">
          <BasicSelect
            v-model="unterveranstaltungCopy.type"
            required
            label="Veranstaltungstyp"
            placeholder="Typ"
            :options="getEnumOptions(UnterveranstaltungTypeMapping)"
          />
        </div>
      </template>
      <div
        v-if="mode === 'update' && loggedInAccount?.role === 'ADMIN'"
        class="lg:col-span-full"
      >
        <BasicInput
          :model-value="gliederung.name + ' (' + gliederung.edv + ')'"
          label="Gliederung"
          class="col-span-2"
          disabled
        />
      </div>
      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="unterveranstaltungCopy.meldebeginn"
          required
          format="dd.MM.yyyy"
          label="Meldebeginn"
          placeholder="Meldebeginn"
          :disabled-dates="disableddates"
        />
      </div>

      <div class="lg:col-span-3">
        <BasicDatepicker
          v-model="unterveranstaltungCopy.meldeschluss"
          required
          format="dd.MM.yyyy"
          label="Meldeschluss"
          placeholder="Meldeschluss"
          :disabled-dates="disableddates"
        />
      </div>
      <div class="lg:col-span-3">
        <BasicInputNumber
          v-model="unterveranstaltungCopy.teilnahmegebuehr"
          required
          label="Teilnahmegebühr"
          placeholder="Teilnahmegebühr"
        />
      </div>
      <div class="lg:col-span-3">
        <BasicInputNumber
          v-model="unterveranstaltungCopy.maxTeilnehmende"
          required
          label="Maximale Teilnehmenden Zahl"
          placeholder="Maximale Teilnehmenden Zahl"
        />
      </div>

      <div class="lg:col-span-full">
        <BasicEditor
          v-model="unterveranstaltungCopy.beschreibung"
          required
          label="Beschreibung"
        />
      </div>
      <div class="lg:col-span-full">
        <BasicEditor
          v-model="unterveranstaltungCopy.bedingungen"
          label="Bedingungen"
        />
      </div>
      <!-- Dokumente ggf. in den Reiter Dokumente verschieben? @ToDo Design stimmt noch nicht -->
      <div class="lg:col-span-full">
        <div class="my-10">
          <div class="text-lg font-semibold">
            Dokumente
            <span
              class="whitespace-nowrap inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset bg-indigo-50 text-indigo-600 ring-indigo-500/10"
            >
              New
            </span>
          </div>
          <p class="max-w-2xl text-sm">Hier kannst Du Dokumente für die Ausschreibung hochladen</p>
        </div>
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          <thead class="border-b border-gray-200">
            <tr>
              <th
                scope="col"
                class="px-3 py-3.5 text-left font-semibold"
              >
                Name
              </th>
              <th scope="col" />
              <th scope="col" />
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-dark-primary">
            <tr
              v-for="(document, index) in documents"
              :key="'document-' + index"
              class="even:bg-gray-50 dark:even:bg-gray-800"
            >
              <td class="whitespace-nowrap w-full py-5 pl-4 pr-3">
                <BasicInput
                  :id="'documentName-' + index"
                  v-model="document.name"
                />
              </td>
              <td class="pl-4 pr-3">
                <DownloadLink :file-id="document.fileId" />
              </td>
              <td class="pl-4 pr-3">
                <XMarkIcon
                  class="h-5 w-5 text-danger-600 cursor-pointer"
                  @click="deleteDocument(document, index)"
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-start">
          <div>
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
              @change="onFileChanged($event)"
            />
          </div>
        </div>
      </div>

      <!-- Einstellungen für die Landing-->
      <UnterveranstaltungLandingSettings
        v-model="landingSettings"
        class="col-span-full"
      />
    </div>
    <div class="mt-8 flex gap-4">
      <Button
        type="submit"
        color="primary"
      >
        <span v-if="!isLoadingCreate && !isLoadingUpdate">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
    </div>

    <div
      v-if="errorCreate || errorUpdate"
      class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
    >
      {{ errorCreate }} {{ errorUpdate }}
    </div>
  </ValidateForm>
</template>
