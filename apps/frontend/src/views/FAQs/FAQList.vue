<script setup lang="ts">
import { apiClient } from '@/api'
import Loading from '@/components/UIComponents/Loading.vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, useTemplateRef, watch } from 'vue'
import draggable from 'vuedraggable'
import FAQFormModal, { type FAQ } from './FAQFormModal.vue'
import { toast } from 'vue-sonner'

type Props = {
  unterveranstaltungId: string
}

const { unterveranstaltungId } = defineProps<Props>()

const { state, isLoading, execute } = useAsyncState(
  async () => apiClient.faq.list.query({ unterveranstaltungId }),
  {},
  { resetOnExecute: false }
)

type Category = {
  name: string
  categoryId: string
  faqs: FAQ[]
}
const categories = ref<Category[]>([])
watch(state, () => {
  categories.value = Object.entries(state.value).map(([name, faqs]) => ({
    name,
    categoryId: faqs[0]?.categoryId ?? '',
    faqs: [...faqs],
  }))
})

const hasKeys = computed(() => categories.value.length > 0)

const formModal = useTemplateRef('formModal')
const editFaq = ref<FAQ>()

function openFormModal(faq?: FAQ) {
  editFaq.value = faq
  formModal.value?.show()
}

async function saveOrder() {
  const faqOrder = categories.value.flatMap((cat) =>
    cat.faqs.map((faq, index) => ({ id: faq.id, order: index, categoryId: cat.categoryId }))
  )
  const categoryOrder = categories.value.map((cat, index) => ({
    id: cat.categoryId,
    order: index,
  }))
  await apiClient.faq.reorder.mutate({ faqOrder, categoryOrder })
  await execute()
  toast.success('FAQ-Reihenfolge gespeichert')
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

  <Loading v-if="isLoading && !hasKeys" />
  <p v-else-if="!hasKeys">Hier wurden noch keine FAQs angelegt.</p>

  <draggable
    v-else
    v-model="categories"
    item-key="categoryId"
    handle=".category-handle"
    class="grid grid-cols-3 gap-8 items-start"
    @end="saveOrder"
  >
    <template #item="{ element: category }">
      <div class="space-y-4 mb-6">
        <div class="flex items-center gap-2">
          <Bars3Icon class="category-handle w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
          <p class="text-gray-500 font-normal">{{ category.name }}</p>
        </div>
        <draggable
          v-model="category.faqs"
          item-key="id"
          handle=".faq-handle"
          group="faqs"
          class="space-y-4"
          @end="saveOrder"
        >
          <template #item="{ element: faq }">
            <div
              class="transition-all rounded-lg shadow hover:shadow-lg bg-primary-5 dark:bg-primary-950 p-2 select-none flex items-start gap-2"
            >
              <Bars3Icon class="faq-handle w-5 h-5 mt-0.5 text-gray-400 cursor-grab active:cursor-grabbing shrink-0" />
              <div
                class="cursor-pointer flex-1"
                @click="() => openFormModal(faq)"
              >
                <span class="font-bold">{{ faq.question }}</span>
                <br />
                <!-- eslint-disable vue/no-v-html -->
                <div v-html="faq.answer" />
                <!-- eslint-enable vue/no-v-html -->
              </div>
            </div>
          </template>
        </draggable>
      </div>
    </template>
  </draggable>
</template>
