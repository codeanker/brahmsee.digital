<script lang="ts" setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import Modal from '@/components/UIComponents/Modal.vue'
import { ValidateForm } from '@codeanker/validation'
import Stammdaten, { type IStammdaten } from '@/components/forms/anmeldung/Stammdaten.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterOutput } from '@codeanker/api'
import { ref } from 'vue'
import { apiClient } from '@/api'

defineProps<{
  account: Awaited<RouterOutput['account']['teilnehmerCreate']> | null
  isOauthRegistration?: boolean
}>()

const emit = defineEmits<{
  submit: [IStammdaten, IRegistrationForm]
}>()

const modal = ref<InstanceType<typeof Modal>>()

export interface IRegistrationForm {
  dataprivacy?: boolean
  email?: string
  gliederung?: { id: number; name: string }
  password?: string
}

const registrationForm = ref<IRegistrationForm>({})

const stammdatenForm = ref<IStammdaten>({
  firstname: '',
  lastname: '',
  gender: 'MALE',
  birthday: null,
})

async function queryObject(searchTerm) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}

defineExpose({
  show: () => modal.value?.show(),
  hide: () => modal.value?.hide(),
})
</script>

<template>
  <Modal
    ref="modal"
    size="xl"
  >
    <template #content>
      <ValidateForm
        v-if="!account"
        class="grow"
        @submit="emit('submit', stammdatenForm, registrationForm)"
      >
        <Stammdaten v-model="stammdatenForm" />
        <hr class="my-5" />
        <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
          <BasicTypeahead
            v-model="registrationForm.gliederung"
            :query="queryObject"
            :input-formatter="(result) => result?.name"
            :result-formatter="(result) => result.name"
            :strict="true"
            label="Gliederung"
            class="col-span-2"
            required
            placeholder="Gliederung eingeben"
          />
          <BasicInput
            v-if="!isOauthRegistration"
            v-model="registrationForm.email"
            label="E-Mail Adresse"
            class="col-span-2"
            type="email"
            required
            placeholder="E-Mail Adresse eingeben"
          />
          <BasicPassword
            v-if="!isOauthRegistration"
            v-model="registrationForm.password"
            label="Passwort"
            class="col-span-2"
            required
            placeholder=""
          />
        </div>
        <hr class="my-5" />
        <Button
          type="submit"
          color="primary"
          full
        >
          Anmelden
        </Button>
      </ValidateForm>
      <div
        v-else
        class="flex flex-col justify-center items-center text-center space-y-4 py-8"
      >
        <CheckCircleIcon class="w-14 h-14 text-primary-700" />
        <h2 class="text-center text-4xl leading-9 tracking-tight text-primary-700 flex items-center justify-center">
          Registrierung erfolgreich
        </h2>
        <div>Du hast Dich erfolgreich registriert. Wir haben dir eine E-Mail mit einem Bestätigungslink geschickt.</div>
      </div>
    </template>
  </Modal>
</template>
