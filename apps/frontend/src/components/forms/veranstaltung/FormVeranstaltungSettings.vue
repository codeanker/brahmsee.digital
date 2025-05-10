<script setup lang="ts">
import { apiClient } from '@/api'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import Button from '@/components/UIComponents/Button.vue'
import { type VeranstaltungSettings } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import { useAsyncState } from '@vueuse/core'
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'

const { veranstaltungId } = defineProps<{
  veranstaltungId: number
}>()

const { state: settings, execute } = useAsyncState(
  () =>
    apiClient.veranstaltung.settingsGet.query({
      veranstaltungId,
    }),
  null,
  { immediate: true }
)

const settingsCopy = ref<VeranstaltungSettings>({ enablePhotoUpload: false })

watch(settings, (settings) => {
  if (settings) {
    settingsCopy.value = settings
  }
})

const errorCreate = ref<Error>()

async function submit() {
  try {
    await apiClient.veranstaltung.settingsPatch.mutate({
      veranstaltungId,
      settings: settingsCopy.value,
    })
    await execute()
    toast('Einstellungen gespeichert')
  } catch (e) {
    toast.error(`${e}`)
  }
}
</script>

<template>
  <ValidateForm
    v-if="settings"
    @submit="submit"
  >
    <div class="space-y-2">
      <BasicSwitch
        v-model="settingsCopy.enablePhotoUpload"
        label="Fotoupload aktivieren"
      />
      <span class="text-sm text-gray-600 dark:text-gray-400">
        Über den Fotoupload können Teilnehmende eigenständig ein Profilbild hochladen, welches dann bspw. für Ausweise
        verwendet werden kann.
      </span>
    </div>

    <div class="mt-8 flex gap-4">
      <Button
        type="submit"
        color="primary"
      >
        Speichern
      </Button>
    </div>

    <div
      v-if="errorCreate"
      class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
    >
      {{ errorCreate }}
    </div>
  </ValidateForm>
</template>
