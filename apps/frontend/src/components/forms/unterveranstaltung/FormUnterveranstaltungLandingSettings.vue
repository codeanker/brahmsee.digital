<script lang="ts" setup>
import { apiClient } from '@/api'
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import Notification from '@/components/LayoutComponents/Notifications.vue'
import { ValidateForm } from '@codeanker/validation'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import Button from '@/components/UIComponents/Button.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { handleUpload } from '@/helpers/handleUpload'
import ConfirmAction from '@/components/UIComponents/ConfirmAction.vue'
import { CheckIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'

type IHeroImages = {
  name: string
  fileId: string
  added: boolean
  id?: string
  mimetype: string | null
  createdAt?: Date
}

type IUpdateHeroImages = {
  name: string
  id: string
}

type IMiscellaneousItem = {
  id?: string
  title: string
  content: string
  added?: boolean
}

type IUpdateMiscellaneousItem = {
  id: string
  title: string
  content: string
}

const props = defineProps<{
  unterveranstaltung?: any
  onUpdate?: () => void
}>()

const heroImages = ref<IHeroImages[]>(props.unterveranstaltung?.landingSettings?.heroImages ?? [])

const unterveranstaltungId = props.unterveranstaltung?.id
const deletedHeroImagesIds = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const deletedMiscellaneousItemsIds = ref<string[]>([])
const miscellaneousItems = ref<IMiscellaneousItem[]>(
  props.unterveranstaltung?.landingSettings?.miscellaneousItems ?? []
)

const showNotification = ref(false)

const landingSettings = ref({
  heroTitle: props.unterveranstaltung?.landingSettings?.heroTitle ?? '',
  heroSubtitle: props.unterveranstaltung?.landingSettings?.heroSubtitle ?? '',
  eventDetailsTitle: props.unterveranstaltung?.landingSettings?.eventDetailsTitle ?? '',
  eventDetailsContent: props.unterveranstaltung?.landingSettings?.eventDetailsContent ?? '',
  miscellaneousVisible: props.unterveranstaltung?.landingSettings?.miscellaneousVisible ?? false,
  miscellaneousTitle: props.unterveranstaltung?.landingSettings?.miscellaneousTitle ?? '',
  miscellaneousSubtitle: props.unterveranstaltung?.landingSettings?.miscellaneousSubtitle ?? '',
  faqVisible: props.unterveranstaltung?.landingSettings?.faqVisible ?? false,
  faqEmail: props.unterveranstaltung?.landingSettings?.faqEmail ?? '',
  instagramVisible: props.unterveranstaltung?.landingSettings?.instagramVisible ?? false,
  instagramUrl: props.unterveranstaltung?.landingSettings?.instagramUrl ?? '',
  facebookVisible: props.unterveranstaltung?.landingSettings?.facebookVisible ?? false,
  facebookUrl: props.unterveranstaltung?.landingSettings?.facebookUrl ?? '',
})

// Watch for prop changes and update local state
watch(
  () => props.unterveranstaltung?.landingSettings,
  (newSettings) => {
    if (newSettings) {
      landingSettings.value = {
        heroTitle: newSettings.heroTitle ?? '',
        heroSubtitle: newSettings.heroSubtitle ?? '',
        eventDetailsTitle: newSettings.eventDetailsTitle ?? '',
        eventDetailsContent: newSettings.eventDetailsContent ?? '',
        miscellaneousVisible: newSettings.miscellaneousVisible ?? false,
        miscellaneousTitle: newSettings.miscellaneousTitle ?? '',
        miscellaneousSubtitle: newSettings.miscellaneousSubtitle ?? '',
        faqVisible: newSettings.faqVisible ?? false,
        faqEmail: newSettings.faqEmail ?? '',
        instagramVisible: newSettings.instagramVisible ?? false,
        instagramUrl: newSettings.instagramUrl ?? '',
        facebookVisible: newSettings.facebookVisible ?? false,
        facebookUrl: newSettings.facebookUrl ?? '',
      }
      heroImages.value = newSettings.heroImages ?? []
      miscellaneousItems.value = newSettings.miscellaneousItems ?? []
      deletedHeroImagesIds.value = []
      deletedMiscellaneousItemsIds.value = []
    }
  },
  { deep: true }
)

const {
  execute: updateUnterveranstaltung,
  error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    const addHeroImages = heroImages.value.filter((image) => image.added).map(({ name, fileId }) => ({ name, fileId }))
    const updateHeroImages: IUpdateHeroImages[] = heroImages.value
      .filter((image) => !image.added && image.id !== undefined)
      .map(({ id, name }) => ({ id: id!, name }))

    const addMiscellaneousItems = miscellaneousItems.value
      .filter((item) => item.added)
      .map(({ title, content }) => ({ title, content }))

    const updateMiscellaneousItems: IUpdateMiscellaneousItem[] = miscellaneousItems.value
      .filter((item) => !item.added && item.id !== undefined)
      .map(({ id, title, content }) => ({ id: id!, title, content }))

    if (loggedInAccount.value?.role === 'ADMIN') {
      await apiClient.unterveranstaltung.verwaltungPatch.mutate({
        id: unterveranstaltungId,
        landingSettings: {
          ...landingSettings.value,
          addHeroImages,
          updateHeroImages,
          deleteHeroImageIds: deletedHeroImagesIds.value,
          addMiscellaneousItems,
          updateMiscellaneousItems,
          deleteMiscellaneousItemIds: deletedMiscellaneousItemsIds.value,
        },
      })
    } else {
      await apiClient.unterveranstaltung.gliederungPatch.mutate({
        id: unterveranstaltungId,
        landingSettings: {
          ...landingSettings.value,
          addHeroImages,
          updateHeroImages,
          deleteHeroImageIds: deletedHeroImagesIds.value,
          addMiscellaneousItems,
          updateMiscellaneousItems,
          deleteMiscellaneousItemIds: deletedMiscellaneousItemsIds.value,
        },
      })
    }

    props.onUpdate?.()
    showNotification.value = true
    // router.back()
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
  heroImages.value.push({
    name: file.name,
    fileId: id,
    added: true,
    mimetype,
  })

  if (fileInput.value) fileInput.value.value = ''
  isUploading.value = false
}

async function deleteHeroImages(image, index) {
  heroImages.value.splice(index, 1)
  if (!image.added) {
    deletedHeroImagesIds.value.push(image.id)
  }
}

const newMiscellaneousItem = ref({
  title: '',
  content: '',
})

const addNewMiscellaneousItem = () => {
  miscellaneousItems.value.push({
    title: newMiscellaneousItem.value.title,
    content: newMiscellaneousItem.value.content,
    added: true,
  })
  newMiscellaneousItem.value.title = ''
  newMiscellaneousItem.value.content = ''
}

const deleteMiscellaneousItem = (item, index) => {
  miscellaneousItems.value.splice(index, 1)
  deletedMiscellaneousItemsIds.value.push(item.id)
}
</script>

<template>
  <div>
    <ValidateForm @submit="updateUnterveranstaltung">
      <div class="divide-y divide-gray-200">
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-8">
          <div>
            <div class="text-md font-semibold">Hero Section</div>
            <p class="text-sm text-gray-500">Die Hero Section ist der erste Bereich auf der Seite.</p>
          </div>
          <div class="md:col-span-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <BasicTextArea
                  v-model="landingSettings.heroTitle"
                  label="Titel"
                  placeholder="Titel"
                  required
                />
              </div>

              <div class="col-span-full">
                <BasicTextArea
                  v-model="landingSettings.heroSubtitle"
                  label="Untertitel"
                  placeholder="Untertitel"
                  required
                />
              </div>
            </div>
            <div class="mt-8">
              <label>Headerbilder</label>
              <div
                v-for="(image, index) in heroImages"
                :key="index"
                class="relative group cursor-pointer mb-2 p-3 rounded-md bg-gray-100"
              >
                <div class="flex justify-between items-center">
                  <div class="">{{ index + 1 }}. {{ image.name }}</div>
                  <ConfirmAction
                    description="Möchtest Du das Bild wirklich löschen?"
                    @confirm="deleteHeroImages(image, index)"
                  >
                    <XMarkIcon class="h-5 w-5 text-danger-600 cursor-pointer"
                  /></ConfirmAction>
                </div>
              </div>
              <!-- Upload Image Wrapper-->
              <label
                v-if="heroImages.length < 4 && !isUploading"
                class="w-full h-40 flex justify-center items-center rounded-lg border border-dashed border-gray-900/25 group hover:border-primary-600 px-6 py-10 cursor-pointer relative"
              >
                <div class="text-center">
                  <div class="text-sm/6 text-gray-600">
                    <div
                      for="file-upload"
                      class="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 group-hover:text-primary-500"
                    >
                      <span>Bild hochladen</span>
                      <input
                        id="file-upload"
                        ref="fileInput"
                        name="file-upload"
                        type="file"
                        class="sr-only"
                        capture
                        accept="image/png, image/jpeg"
                        :disabled="isUploading"
                        @change="onFileChanged($event)"
                      />
                    </div>
                  </div>
                  <p class="text-xs/5 text-gray-600 mb-0">PNG, JPG, maximal 1MB groß</p>
                </div>
              </label>
              <div
                v-if="isUploading"
                class="bg-primary-600 text-white h-40 rounded-lg mt-2 py-3 flex justify-center items-center"
              >
                <Loading class="text-white" />
                Bild hochladen…
              </div>

              <!-- <div
                v-for="(image, index) in heroImages"
                :key="index"
                class="hidden h-40 w-40 aspect-square relative group cursor-pointer rounded-lg"
              >
                <div class="hidden group-hover:block absolute inset-0 bg-black opacity-50 rounded-lg transition"></div>
                <div
                  class="hidden group-hover:flex absolute inset-0 justify-center items-center text-white text-sm/6 font-semibold transition"
                >
                  Löschen
                </div>
                <div
                  class="hidden absolute inset-0 flex justify-center items-center bg-primary-600 text-white rounded-lg"
                >
                  <Loading class="text-white" />
                  hochladen
                </div>

                <img
                  src="https://placehold.co/600x400"
                  alt="Placeholder"
                  class="rounded-lg aspect-square object-cover"
                />
              </div> -->

              <!-- <div class="hidden w-40 aspect-square relative group cursor-pointer rounded-lg">
                <div class="hidden group-hover:block absolute inset-0 bg-black opacity-50 rounded-lg transition"></div>
                <div
                  class="hidden group-hover:flex absolute inset-0 justify-center items-center text-white text-sm/6 font-semibold transition"
                >
                  Löschen
                </div>
                <div
                  class="hidden absolute inset-0 flex justify-center items-center bg-primary-600 text-white rounded-lg"
                >
                  <Loading class="text-white" />
                  hochladen
                </div>

                <img
                  src="https://placehold.co/600x400"
                  alt="Placeholder"
                  class="rounded-lg aspect-square object-cover"
                />
              </div> -->
              <!-- // Upload Image Wrapper-->
            </div>
          </div>
        </div>

        <!-- Veranstaltungs Details -->
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-8">
          <div>
            <div class="text-md font-semibold">Veranstaltungsdetails</div>
            <p class="text-sm text-gray-400">
              In dieser Section kannst Du einen eigenen Text hinterlegen, dieser wird neben den Veranstaltungsdetails
              wie Beginn und Ende angezeigt.
            </p>
          </div>

          <div class="md:col-span-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <BasicTextArea
                  v-model="landingSettings.eventDetailsTitle"
                  label="Titel"
                  placeholder="Titel"
                  required
                />
              </div>

              <div class="col-span-full">
                <BasicEditor
                  v-model="landingSettings.eventDetailsContent"
                  label="Content"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Miscellaneous Details-->
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-8">
          <div>
            <div class="text-md font-semibold">Miscellaneous</div>
            <p class="text-sm text-gray-400">
              Diese Section ist optional, hier kannst Du z.B. unterschiedliche Aufzählungen mit einer Beschreibung
              machen.
            </p>
          </div>

          <div class="md:col-span-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <BasicSwitch
                  v-model="landingSettings.miscellaneousVisible"
                  label="Anzeigen"
                />
              </div>
              <div
                v-if="landingSettings.miscellaneousVisible"
                class="col-span-full"
              >
                <BasicTextArea
                  v-model="landingSettings.miscellaneousTitle"
                  label="Miscellaneous Titel"
                  placeholder="Titel"
                  required
                />
              </div>

              <div
                v-if="landingSettings.miscellaneousVisible"
                class="col-span-full"
              >
                <BasicTextArea
                  v-model="landingSettings.miscellaneousSubtitle"
                  label="Miscellaneous Untertitel"
                  placeholder="Untertitel"
                  required
                />
              </div>
            </div>
            <div
              v-if="landingSettings.miscellaneousVisible"
              class="mt-8"
            >
              <label>Aufzählungen<span class="text-danger-600">*</span></label>
              <div
                v-for="(item, index) in miscellaneousItems"
                :key="index"
                class="relative group cursor-pointer mb-2 p-3 rounded-md bg-gray-100"
              >
                <div class="flex justify-between items-center">
                  <div class="flex items-start gap-x-3 text-gray-900">
                    <CheckIcon
                      class="size-5 mt-1 flex-none text-primary-600"
                      aria-hidden="true"
                    />
                    <div>
                      <div class="font-semibold">{{ item.title }}</div>
                      <div class="">{{ item.content }}</div>
                    </div>
                  </div>
                  <ConfirmAction
                    description="Möchtest Du den Eintrag wirklich löschen?"
                    @confirm="deleteMiscellaneousItem(item, index)"
                  >
                    <XMarkIcon class="h-5 w-5 text-danger-600 cursor-pointer"
                  /></ConfirmAction>
                </div>
              </div>
              <div class="mt-8 space-y-8">
                <BasicInput
                  v-model="newMiscellaneousItem.title"
                  label="Item Titel"
                />
                <BasicTextArea
                  v-model="newMiscellaneousItem.content"
                  label="Item Content"
                />
                <Button
                  color="primary"
                  :disabled="!newMiscellaneousItem.title || !newMiscellaneousItem.content"
                  @click="addNewMiscellaneousItem"
                  >Hinzufügen
                </Button>
              </div>
            </div>
          </div>
        </div>
        <!-- FAQ -->
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-8">
          <div>
            <div class="text-md font-semibold">FAQ</div>
            <p class="text-sm text-gray-400">
              Beantworte häufig gestellte Fragen in dem Du eine Frage und eine Antwort angibst. Die Fragen und Antworten
              kannst Du im Tab FAQ bearbeiten.
            </p>
          </div>

          <div class="md:col-span-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <BasicSwitch
                  v-model="landingSettings.faqVisible"
                  label="Anzeigen"
                />
              </div>
              <div
                v-if="landingSettings.faqVisible"
                class="col-span-full"
              >
                <BasicInput
                  v-model="landingSettings.faqEmail"
                  type="email"
                  label="Email für Nachfragen"
                  placeholder="example@gliederung.dlrg.de"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Social Media -->
        <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-8">
          <div>
            <div class="text-md font-semibold">Social Media</div>
            <p class="text-sm text-gray-400">
              Pflege hier die Links zu euren Social Media Kanälen, diese werdem im Footer angezeigt.
            </p>
          </div>
          <div class="md:col-span-2">
            <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="col-span-full">
                <BasicInput
                  v-model="landingSettings.instagramUrl"
                  label="Instagram URL"
                />
              </div>

              <div class="col-span-full">
                <BasicInput
                  v-model="landingSettings.facebookUrl"
                  label="Facebook URL"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="errorUpdate"
        class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
      >
        {{ errorUpdate }}
      </div>
      <div class="mt-8 flex gap-4">
        <Button
          type="submit"
          color="primary"
        >
          <span v-if="!isLoadingUpdate">Speichern</span>
          <span v-else>Loading...</span>
        </Button>
      </div>
    </ValidateForm>
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
