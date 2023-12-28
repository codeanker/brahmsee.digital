<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/UIComponents/Button.vue'
import { reAuthenticate } from '@/composables/useAuthentication'
import router from '@/router'
import type { RouterInput } from '@codeanker/api'
import { dayjs } from '@codeanker/helpers'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  person?: any
  isSelf?: boolean
  mode: 'create' | 'update'
  onUpdate?: () => void
}>()

const fill = (person) => {
  return {
    firstname: person?.firstname,
    lastname: person?.lastname,
    email: person?.email,
    password: person?.password ?? '',
    gender: person?.gender || 'null',
    birthday: person?.birthday === undefined ? 'null' : dayjs(person.birthday).toDate(),
    role: 'ADMIN', // TODO: Select
  }
}

const personId = parseInt(props.person?.id as string)
const personCopy = ref(fill(props.person) ?? { role: 'ADMIN' })

const {
  execute: createPerson,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.person.verwaltungCreate.mutate({
      data: personCopy.value as unknown as RouterInput['person']['verwaltungCreate']['data'],
    })
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updatePerson,
  // error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    // @todo typing
    await apiClient.person.verwaltungPatch.mutate({
      id: personId,
      data: personCopy.value as unknown as RouterInput['person']['verwaltungPatch']['data'],
    })

    if (props.isSelf) {
      await reAuthenticate()
    }

    props.onUpdate?.()
  },
  null,
  { immediate: false }
)

const handle = async (event: Event) => {
  event.preventDefault()
  switch (props.mode) {
    case 'create':
      await createPerson()
      break
    case 'update':
      await updatePerson()
      break
  }
}
</script>

<template>
  <form @submit="handle">
    <div class="grid grid-cols-1 sm:grid-cols-6 gap-6">
      <div class="sm:col-span-3">
        <BasicInput
          v-model="personCopy.firstname"
          label="Vorname"
          name="firstname"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicInput
          v-model="personCopy.lastname"
          label="Nachname"
          name="lastname"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicDatepicker
          v-model="personCopy.birthday"
          label="Geburtsdatum"
          name="birthday"
          required
          :utc="true"
          format="dd.MM.yyyy"
        />
      </div>

      <div class="sm:col-span-3">
        <BasicSelect
          v-model="personCopy.gender"
          label="Geschlecht"
          name="gender"
          :options="[
            {
              label: 'Männlich',
              value: 'MALE',
            },
            {
              label: 'Weiblich',
              value: 'FEMALE',
            },
            {
              label: 'Divers',
              value: 'UNSPECIFIED',
            },
          ]"
        />
      </div>

      <div class="col-span-full">
        <BasicInput
          v-model="personCopy.email"
          label="Email"
          name="email"
          type="email"
          required
        />
      </div>

      <div
        v-if="mode === 'create'"
        class="col-span-full"
      >
        <BasicPassword
          v-model="personCopy.password"
          label="Passwort"
          required
        />
      </div>
    </div>

    <div class="mt-8 flex gap-4">
      <Button
        type="submit"
        color="primary"
        @click="handle"
      >
        <span v-if="!isLoadingCreate && !isLoadingUpdate">Speichern</span>
        <span v-else>Loading...</span>
      </Button>
    </div>

    <div
      v-if="errorCreate"
      class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
    >
      {{ errorCreate }}
    </div>
  </form>
</template>
