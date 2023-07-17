<template>
  <form @submit="handle">
    <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
      <div class="sm:col-span-3">
        <BasicInput
          v-model="userCopy.firstname"
          label="Vorname"
          name="firstname"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicInput
          v-model="userCopy.lastname"
          label="Nachname"
          name="lastname"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicDatepicker
          v-model="userCopy.birthdate"
          label="Geburtsdatum"
          name="birthdate"
          required
          :utc="true"
          format="dd.MM.yyyy"
        />
      </div>

      <div class="sm:col-span-3">
        <BasicSelect
          v-model="userCopy.sex"
          label="Geschlecht"
          name="sex"
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
          v-model="userCopy.email"
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
          v-model="userCopy.password"
          label="Passwort"
          required
        />
      </div>
    </div>

    <div class="mt-8 flex gap-4">
      <Button
        type="reset"
        color="warning"
        @click="reset"
      >
        Zurücksetzen
      </Button>
      <Button
        type="submit"
        color="primary"
        @click="handle"
      >
        <span v-if="!isLoadingCreate && !isLoadingUpdate">Speichern</span>
        <span v-else><i class="fa-sharp fa-light fa-spinner-third fa-2xl"></i></span>
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

<script setup lang="ts">
import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/Button.vue'
import useAuthentication from '@/composables/useAuthentication'
import router from '@/router'
import { dayjs } from '@codeanker/helpers'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

const { reAuthenticate } = useAuthentication()

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
  isSelf?: boolean
  mode: 'create' | 'update'
  onUpdate?: () => void
}

const fill = (user) => {
  return {
    id: user?.id,
    firstname: user?.firstname,
    lastname: user?.lastname,
    email: user?.email,
    password: user?.password ?? '',
    sex: user?.sex || 'null',
    birthdate: user?.birthday === undefined ? 'null' : dayjs(user.birthday).toDate(),
    role: 'ADMIN', // TODO: Select
  }
}

const props = defineProps<Props>()
const userCopy = ref(fill(props.user) ?? { role: 'ADMIN' })

const {
  execute: createUser,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    await apiClient.user.create.mutate(userCopy.value)
    router.back()
  },
  null,
  { immediate: false }
)

const {
  execute: updateUser,
  error: errorUpdate,
  isLoading: isLoadingUpdate,
} = useAsyncState(
  async () => {
    await apiClient.user.update.mutate(userCopy.value)

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
      await createUser()
      break
    case 'update':
      await updateUser()
      break
  }
}

const reset = () => {
  userCopy.value = props.user ?? {}
}
</script>
