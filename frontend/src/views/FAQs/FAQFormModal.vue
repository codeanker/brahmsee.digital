<script setup lang="ts">
export type FAQ = RouterOutput['faq']['list'][string][number]

export type Props = {
  unterveranstaltungId: number
  faq?: FAQ
}

import { apiClient } from '@/api'
import Abbr from '@/components/Abbr.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { ModalApi } from '@/components/UIComponents/Modal.vue'
import Modal from '@/components/UIComponents/Modal.vue'
import type { RouterOutput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import { computed, ref, useTemplateRef, watch } from 'vue'

const props = defineProps<Props>()

const emit = defineEmits<{
  success: []
}>()

const isEdit = computed(() => props.faq !== undefined)

const formData = ref({
  question: '',
  answer: '',
  category: '',
})

function queryCategories(term?: string) {
  return apiClient.faq.searchCategory.query({ term })
}

const modal = useTemplateRef('modal')

watch(
  props,
  ({ faq }) => {
    if (!faq) {
      return
    }

    formData.value = {
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    }
  },
  { immediate: true }
)

function onClose() {
  formData.value = {
    question: '',
    answer: '',
    category: '',
  }
}

async function onSubmit() {
  if (isEdit.value) {
    await apiClient.faq.update.mutate({
      unterveranstaltungId: props.unterveranstaltungId,
      id: props.faq!.id,
      faq: formData.value,
    })
  } else {
    await apiClient.faq.create.mutate({
      unterveranstaltungId: props.unterveranstaltungId,
      faq: formData.value,
    })
  }

  modal.value?.hide()
  emit('success')
}

defineExpose<ModalApi>({
  show(ctx) {
    modal.value?.show(ctx)
  },
  hide(ctx) {
    modal.value?.hide(ctx)
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
            <p class="text-xl font-bold">
              <template v-if="isEdit"><Abbr abbr="faq" /> bearbeiten</template>
              <template v-else><Abbr abbr="faq" /> erstellen</template>
            </p>
          </div>

          <ValidateForm
            class="grid grid-cols-2 gap-4"
            @submit="onSubmit"
          >
            <BasicInput
              v-model="formData.question"
              label="Frage"
              required
            />
            <BasicTypeahead
              v-model="formData.category"
              label="Kategorie"
              required
              :query="queryCategories"
            />
            <div class="col-span-2">
              <BasicEditor
                v-model="formData.answer"
                label="Antwort"
                required
              />
            </div>

            <div class="flex justify-end col-span-2 mt-8">
              <Button type="submit"> Speichern </Button>
            </div>
          </ValidateForm>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>
