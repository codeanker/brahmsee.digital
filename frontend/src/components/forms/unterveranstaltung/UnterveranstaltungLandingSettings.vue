<script lang="ts" setup>
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
import { computed } from 'vue'

export interface IHeroImages {
  url: string
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
  hero: {
    title: string
    subtitle: string
    images: IHeroImages[]
  }
  eventDetails: {
    title: string
    content: string
  }
  miscellaneous: {
    visible: boolean
    title?: string
    subtitle?: string
    items?: IMiscellaneousItem[]
  }
  faq: {
    visible?: boolean
    email?: string
    items?: IFaqItem[]
  }
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
                v-model="model.hero.title"
                label="Titel"
                placeholder="Titel"
                required
              />
            </div>

            <div class="col-span-full">
              <BasicTextArea
                v-model="model.hero.subtitle"
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
                v-model="model.eventDetails.title"
                label="Titel"
                placeholder="Titel"
                required
              />
            </div>

            <div class="col-span-full">
              <BasicEditor
                v-model="model.eventDetails.content"
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
                v-model="model.miscellaneous.visible"
                label="Anzeigen"
              />
            </div>
            <div
              v-if="model.miscellaneous.visible"
              class="col-span-full"
            >
              <BasicTextArea
                v-model="model.miscellaneous.title"
                label="Titel"
                placeholder="Titel"
                required
              />
            </div>

            <div
              v-if="model.miscellaneous.visible"
              class="col-span-full"
            >
              <BasicTextArea
                v-model="model.miscellaneous.subtitle"
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
                v-model="model.faq.visible"
                label="Anzeigen"
              />
            </div>
            <div
              v-if="model.faq.visible"
              class="col-span-full"
            >
              <BasicInput
                v-model="model.faq.email"
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
