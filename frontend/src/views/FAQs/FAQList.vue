<script setup lang="ts">
import { apiClient } from '@/api'
import Loading from '@/components/UIComponents/Loading.vue'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import FAQFormModal, { type FAQ } from './FAQFormModal.vue'

type Props = {
  unterveranstaltungId: number
}

const { unterveranstaltungId } = defineProps<Props>()

const { state, isLoading, execute } = useAsyncState(() => apiClient.faq.list.query({ unterveranstaltungId }), {})
const hasKeys = computed(() => Object.keys(state.value).length > 0)

const formModal = useTemplateRef('formModal')
const editFaq = ref<FAQ>()

function openFormModal(faq?: FAQ) {
  if (faq !== undefined) {
    editFaq.value = faq
  }
  formModal.value?.show()
}

defineExpose({
  openFormModal,
})
</script>

<template>
  <FAQFormModal
    ref="formModal"
    :unterveranstaltung-id="unterveranstaltungId"
    :faq="editFaq"
    @success="execute"
  />

  <Loading v-if="isLoading" />
  <p v-else-if="!hasKeys">Hier wurden noch keine FAQs angelegt.</p>

  <div
    v-for="(list, category) in state"
    v-else
    :key="category"
    class="space-y-4"
  >
    <p class="text-xl font-medium">{{ category }}</p>
    <div
      v-for="(faq, index) in list"
      :key="index"
      class="transition-all rounded-lg shadow hover:shadow-lg bg-primary-5 dark:bg-primary-950 p-2 select-none cursor-pointer"
      @click="() => openFormModal(faq)"
    >
      <span class="font-bold">{{ faq.question }}</span>
      <br />
      <div v-html="faq.answer" />
    </div>
  </div>
</template>
