<script setup lang="ts">
import { apiClient } from '@/api'
import cn from '@/helpers/cn'
import { getCustomFieldIcon } from '@/helpers/getCustomFieldIcon'
import { CustomFieldTypeMapping, type Prisma } from '@codeanker/api'
import { useAsyncState } from '@vueuse/core'
import { ref, useTemplateRef } from 'vue'
import Button from '../UIComponents/Button.vue'
import Modal, { type ModalApi } from '../UIComponents/Modal.vue'

type Emits = {
  select: [Prisma.CustomFieldCreateInput]
}

const emit = defineEmits<Emits>()

const { state: templates } = useAsyncState(
  () => apiClient.customFields.listTemplates.query(),
  {},
  {
    immediate: true,
  }
)

const selected = ref<string>()

const modal = useTemplateRef('modal')

function onClose() {
  selected.value = undefined
}

function onSelect() {
  if (!selected.value) {
    return
  }

  const customField = templates.value[selected.value]

  modal.value?.hide()
  emit('select', customField)
}

defineExpose<ModalApi>({
  show() {
    modal.value?.show()
  },
  hide() {
    modal.value?.hide()
  },
})
</script>

<template>
  <Teleport to="body">
    <Modal
      ref="modal"
      @close="onClose"
    >
      <template #content>
        <div class="space-y-8">
          <div>
            <p class="text-xl font-bold">Vorlagen für benutzerdefinierte Felder</p>
            <p>
              Wähle im Folgenden eine Vorlage aus, die du verwenden möchtest. Im Anschluss hast du noch die Möglichkeit,
              diese anzupassen.
            </p>
          </div>

          <div class="flex flex-col gap-y-4 select-none">
            <div
              v-for="(template, index) in templates"
              :key="index"
              :class="
                cn(
                  'group',
                  'bg-primary-50 border border-primary-600 rounded-lg px-8 py-2 shadow transition-colors hover:bg-primary-600 hover:text-white cursor-pointer',
                  'flex flex-row items-center gap-x-8',
                  { 'bg-primary-600 text-white': selected === index }
                )
              "
              @click="selected = index"
            >
              <img
                :src="getCustomFieldIcon(template.type)"
                :class="
                  cn('h-5 w-5 mr-1', { invert: selected === index }, { 'group-hover:invert': selected !== index })
                "
              />

              <div class="flex flex-col">
                <span class="font-bold">
                  {{ template.name }}
                </span>
                <span class="text-sm">
                  {{ CustomFieldTypeMapping[template.type].human }}
                </span>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <Button
              type="button"
              :disabled="selected === undefined"
              @click="onSelect"
            >
              Auswählen
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>
