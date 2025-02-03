<script lang="ts" setup>
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
import { computed } from 'vue'

export interface IHeroImages {
  fileId: string
  name: string
}

export interface IFaqItem {
  question: string
  answer: string
}

export interface IMiscellaneousItem {
  title: string
  content: string
}

export interface ILandingSettings {
  heroTitle: string
  heroSubtitle: string
  heroImages: IHeroImages[]

  eventDetailsTitle: string
  eventDetailsContent: string

  miscellaneousVisible: boolean
  miscellaneousTitle?: string
  miscellaneousSubtitle?: string
  miscellaneousItems?: IMiscellaneousItem[]

  faqVisible: boolean
  faqEmail?: string

  instagramVisible: boolean
  instagramUrl?: string

  facebookVisible: boolean
  facebookUrl?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: ILandingSettings
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [ILandingSettings]
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <div>
    <div class="my-10">
      <div class="text-lg font-semibold">
        Öffentliche Seite
        <span
          class="whitespace-nowrap inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset bg-indigo-50 text-indigo-600 ring-indigo-500/10"
        >
          New
        </span>
      </div>
      <p class="max-w-2xl text-sm">
        Passe die Inhalte für die öffentliche Seite an um diese für deine Gliederung zu personalisieren.
      </p>
    </div>
    <pre>{{ model }}</pre>
    <div class="divide-y divide-gray-200">
      <!-- Hero Section-->
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-16">
        <div>
          <div class="text-md font-semibold">Hero Section</div>
          <p class="text-sm text-gray-400">Die Hero Section ist der erste Bereich auf der Seite.</p>
        </div>

        <div class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <BasicTextArea
                v-model="model.heroTitle"
                label="Titel"
                placeholder="Titel"
                required
              />
            </div>

            <div class="col-span-full">
              <BasicTextArea
                v-model="model.heroSubtitle"
                label="Untertitel"
                placeholder="Untertitel"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Event Details -->
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-16">
        <div>
          <div class="text-md font-semibold">Veranstaltungsdetails</div>
          <p class="text-sm text-gray-400">
            In dieser Section kannst Du einen eigenen Text hinterlegen, dieser wird neben den Veranstaltungsdetails wie
            Beginn und Ende angezeigt.
          </p>
        </div>

        <div class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <BasicTextArea
                v-model="model.eventDetailsTitle"
                label="Titel"
                placeholder="Titel"
                required
              />
            </div>

            <div class="col-span-full">
              <BasicEditor
                v-model="model.eventDetailsContent"
                label="Content"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <!-- Miscellaneous Details -->
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-16">
        <div>
          <div class="text-md font-semibold">Miscellaneous</div>
          <p class="text-sm text-gray-400">
            Diese Section ist optional, hier kannst Du z.B. unterschiedliche Aufzählungen mit einer Beschreibung machen.
          </p>
        </div>

        <div class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <BasicSwitch
                v-model="model.miscellaneousVisible"
                label="Anzeigen"
              />
            </div>
            <div
              v-if="model.miscellaneousVisible"
              class="col-span-full"
            >
              <BasicTextArea
                v-model="model.miscellaneousTitle"
                label="Titel"
                placeholder="Titel"
                required
              />
            </div>

            <div
              v-if="model.miscellaneousVisible"
              class="col-span-full"
            >
              <BasicTextArea
                v-model="model.miscellaneousSubtitle"
                label="Untertitel"
                placeholder="Untertitel"
                required
              />
            </div>
          </div>
        </div>
      </div>
      <!-- FAQ -->
      <div class="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-3 py-16">
        <div>
          <div class="text-md font-semibold">FAQ</div>
          <p class="text-sm text-gray-400">
            Beantworte häufig gestellte Fragen in dem Du eine Frage und eine Antwort angibst.
          </p>
        </div>

        <div class="md:col-span-2">
          <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="col-span-full">
              <BasicSwitch
                v-model="model.faqVisible"
                label="Anzeigen"
              />
            </div>
            <div
              v-if="model.faqVisible"
              class="col-span-full"
            >
              <BasicInput
                v-model="model.faqEmail"
                type="email"
                label="Email für Nachfragen"
                placeholder="example@gliederung.dlrg.de"
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
