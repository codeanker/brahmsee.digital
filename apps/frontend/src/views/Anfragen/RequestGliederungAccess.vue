<script setup lang="ts">
import { apiClient } from '@/api'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import Modal from '@/components/UIComponents/Modal.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { CheckCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, ref, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

if (loggedInAccount.value?.role !== 'USER') {
  router.replace({
    name: 'Dashboard',
  })
}

const { data: requests, refetch } = useQuery({
  queryKey: ['listOwnGliederungAdminRequests'],
  queryFn: () => apiClient.access.listOwnGliederungAdminRequests.query(),
  initialData: [],
})

const gliederung = ref({ id: null })
const isValid = computed(() => typeof gliederung.value.id === 'string')

async function queryObjectGliederungen(searchTerm: string) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}

const modalAdd = useTemplateRef('modalAdd')

const { mutate, error, isPending, isSuccess, isError } = useMutation({
  mutationKey: ['requestGliederungAdminCreate'],
  mutationFn: async () => {
    if (gliederung.value.id === null) {
      throw new Error('Gliederung must be selected')
    }

    await apiClient.access.requestGliederungAdminCreate.mutate({ gliederungId: gliederung.value.id })
    modalAdd.value?.hide()
    await refetch()
  },
})
</script>

<template>
  <div class="col-span-2">
    <div class="my-4 flex items-center justify-between">
      <div>
        <p class="text-xl font-bold">Gliederungsanfragen</p>
        <p class="text-sm">Hier findest deine Zugriffsanfragen auf Gliederungen.</p>
      </div>
      <span
        v-if="requests.length === 0"
        class="text-primary-500 flex items-center cursor-pointer"
        @click="() => modalAdd?.show()"
      >
        <PlusIcon class="h-5 w-5 mr-1" />
        <span>Anfrage erstellen</span>
      </span>
    </div>

    <ul>
      <li
        v-for="request in requests"
        :key="request.gliederungId"
        class="list-disc list-inside"
      >
        <span>{{ request.gliederung.name }}</span>
      </li>
    </ul>
  </div>

  <template v-if="requests.length === 0">
    <Teleport to="body">
      <Modal ref="modalAdd">
        <template #content>
          <div class="text-xl font-bold mb-8">Zugriff auf Gliederung anfragen</div>

          <p>
            Suche nachfolgend nach einer Gliederung, auf welche du Zugriff erhalten möchtest. Die Anfrage muss von der
            Gliederung bestätigt werden. Über Aktualisierungen wirst du per E-Mail auf dem Laufenden gehalten.
          </p>

          <BasicTypeahead
            v-model="gliederung"
            :query="queryObjectGliederungen"
            :input-formatter="(result) => result?.name"
            :result-formatter="(result) => result.name"
            :strict="true"
            label="Gliederung"
            required
            placeholder="Gliederung eingeben"
          />

          <div class="mt-8 flex gap-4">
            <Button
              type="submit"
              color="primary"
              :disabled="!isValid || isSuccess"
              @click="mutate"
            >
              <template v-if="isPending">
                <Loading class="text-white mx-auto" />
              </template>
              <span>Speichern</span>
            </Button>
          </div>

          <template v-if="isSuccess">
            <div class="flex flex-col text-center items-center justify-center">
              <CheckCircleIcon class="h-10 mb-2 text-primary-600" />
              <span> Wir haben deine Anfrage erhalten. </span>
            </div>
          </template>

          <template v-if="isError">
            <div class="flex flex-col text-center items-center justify-center text-danger-600">
              <XMarkIcon class="h-10 mb-2" />
              <span> {{ error }} </span>
            </div>
          </template>
        </template>
      </Modal>
    </Teleport>
  </template>
</template>
