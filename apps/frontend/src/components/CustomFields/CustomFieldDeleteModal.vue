<script setup lang="ts">
import { useTemplateRef } from 'vue'
import Button from '../UIComponents/Button.vue'
import Modal, { type ModalApi } from '../UIComponents/Modal.vue'
import { useAsyncState } from '@vueuse/core'
import type { RouterOutput } from '@codeanker/api'
import { apiClient } from '@/api'

type Props = {
  entity: 'veranstaltung' | 'unterveranstaltung'
  entityId: number
  field: RouterOutput['customFields']['get']
}

type Emits = {
  delete: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const modal = useTemplateRef('modal')

const {
  execute: doDelete,
  error: errorDelete,
  isLoading: isDeleting,
} = useAsyncState(
  async () => {
    if (!props.field) {
      return
    }

    switch (props.entity) {
      case 'veranstaltung':
        await apiClient.customFields.veranstaltungDelete.mutate({
          fieldId: props.field.id,
          veranstaltungId: props.entityId,
        })
        break
      case 'unterveranstaltung':
        await apiClient.customFields.unterveranstaltungDelete.mutate({
          fieldId: props.field.id,
          unterveranstaltungId: props.entityId,
        })
        break
      default:
        break
    }

    emit('delete')
  },
  null,
  { immediate: false }
)

defineExpose<ModalApi>({
  show() {
    if (isDeleting) {
      return
    }

    modal.value?.show()
  },
  hide() {
    if (isDeleting) {
      return
    }

    modal.value?.hide()
  },
})
</script>

<template>
  <Teleport to="body">
    <Modal ref="modal">
      <template #content>
        <div class="space-y-8">
          <div>
            <p class="text-xl font-bold">Benutzerdefiniertes Feld &quot;{{ field.name }}&quot; löschen</p>
            <p>
              Wenn du das benutzerdefinierte Feld löschst, gehen sämtliche damit verbundenen Eingaben aus den
              Anmeldungen unwiderruflich verloren.
            </p>
            <p>Bist du sicher, dass du das Feld löschen möchtest?</p>
          </div>

          <p
            v-if="errorDelete"
            class="my-4"
          >
            {{ errorDelete }}
          </p>

          <div class="flex gap-x-4 justify-end">
            <Button
              type="button"
              @click="modal?.hide()"
            >
              Feld behalten
            </Button>
            <Button
              type="button"
              color="danger"
              @click="doDelete"
            >
              Feld löschen
            </Button>
          </div>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>
