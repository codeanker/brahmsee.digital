<script setup lang="ts">
import { computed, ref } from 'vue'

import BasicInput from '../BasicInputs/BasicInput.vue'
import Modal from './Modal.vue'
import Button from './Button.vue'
import { apiClient } from '@/api'
import { DocumentDuplicateIcon, RocketLaunchIcon } from '@heroicons/vue/24/outline'
import { useQueryClient } from '@tanstack/vue-query'

const props = defineProps<{
  veranstaltung: string
  unterveranstaltungId: string
  url: string
}>()

const emit = defineEmits<{
  success: []
}>()

const modal = ref<InstanceType<typeof Modal>>()

const open = () => {
  if (modal.value) {
    modal.value.show()
  }
}

const close = () => {
  if (modal.value) {
    modal.value.hide()

    comment.value = ''
    token.value = ''
    state.value = 'idle'
  }
}

const state = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const error = ref()

const comment = ref('')
const token = ref('')
const locked = ref(true)

const queryClient = useQueryClient()

async function create() {
  if (state.value !== 'idle') {
    return
  }

  try {
    token.value = await apiClient.anmeldungLink.create.mutate({
      unterveranstaltungId: props.unterveranstaltungId,
      comment: comment.value,
    })

    state.value = 'success'

    queryClient.invalidateQueries({ queryKey: ['anmeldeLink'] })
    emit('success')
  } catch (e: unknown) {
    state.value = 'error'
    error.value = e
  }
}

const publicLink = computed(() => `${props.url}?token=${token.value}`)

function copyLink() {
  navigator.clipboard.writeText(publicLink.value)
  locked.value = false
}

defineExpose({ open, close })
</script>

<template>
  <Teleport to="body">
    <Modal
      ref="modal"
      :closeable="false"
    >
      <template #content>
        <div class="space-y-4">
          <h4 class="mb-0">Anmeldelink erstellen</h4>

          <template v-if="token">
            <p>Der Anmeldelink wurde erfolgreich erstellt.</p>

            <div class="p-6 bg-primary-100 dark:bg-primary-900 rounded-md my-8 flex items-top space-x-4">
              <div><RocketLaunchIcon class="h-10 w-10 text-primary-500" /></div>
              <div>
                <div class="font-bold text-lg text-primary-500">Juhuuu deine Ausschreibung ist ready</div>
                <div>Teilnehmende können sich unter dem folgenden Link anmelden.</div>
                <div class="flex mt-4">
                  <input
                    id="linkInput"
                    v-model="publicLink"
                    type="text"
                    class="form-control rounded-r-none bg-white dark:bg-primary-950"
                    placeholder="Link"
                    readonly
                    @click="copyLink"
                  />
                  <button
                    class="p-2 btn-primary rounded-l-none"
                    type="button"
                    @click="copyLink"
                  >
                    <DocumentDuplicateIcon class="size-5" />
                  </button>
                </div>
              </div>
            </div>

            <Button
              class="w-full"
              color="primary"
              :disabled="locked"
              @click="close"
            >
              Schließen
            </Button>
          </template>
          <template v-else>
            <p>
              Nachfolgend kannst du einen Anmeldelink für die Veranstaltung <u>{{ props.veranstaltung }}</u> erstellen.
            </p>
            <p>Dieser Link umgeht die Beschränkungen Meldeschluss und maximale Teilnehmendenzahl.</p>

            <BasicInput
              v-model="comment"
              label="Bemerkung"
            />

            <p
              v-if="error"
              class="text-danger-500 text-sm"
            >
              {{ error }}
            </p>

            <div class="flex gap-x-4 justify-end">
              <Button
                color="warning"
                :disabled="state === 'loading'"
                @click="close"
              >
                Abbrechen
              </Button>
              <Button
                :disabled="state === 'loading'"
                @click="create"
              >
                Speichern
              </Button>
            </div>
          </template>
        </div>
      </template>
    </Modal>
  </Teleport>
</template>
