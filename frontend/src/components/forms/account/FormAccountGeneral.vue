<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import type { IStammdaten } from '../anmeldung/Stammdaten.vue'
import Stammdaten from '../anmeldung/Stammdaten.vue'

import { apiClient } from '@/api'
import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import PasswordStrength from '@/components/PasswordStrength.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import router from '@/router'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { getEnumOptions, roleMapping } from '@codeanker/api/src/enumMappings'
import { ValidateForm } from '@codeanker/validation'

type Account = Awaited<RouterOutput['account']['verwaltungGet']>

const props = defineProps<{
  account?: Account
  onUpdate?: () => void
}>()

const isSelf = computed(() => props.account?.id === loggedInAccount.value?.id)
const edit = computed(() => props.account !== undefined)

const stammdatenForm = ref<IStammdaten>({})
const accountForm = ref({
  email: props.account?.email ?? '',
  password: '',
  roleId: props.account?.role ?? '',
  isActiv: !!props.account?.activatedAt,
})

const roles = getEnumOptions(roleMapping)

const password = ref({
  password_old: '',
  password: '',
  password_confirm: '',
})

const passwordStrength = ref()

const {
  execute: createAccount,
  error: errorCreate,
  isLoading: isLoadingCreate,
} = useAsyncState(
  async () => {
    await apiClient.account.verwaltungCreate.mutate({
      // @ts-expect-error Stammdaten sind optional
      data: {
        ...accountForm.value,
        ...stammdatenForm.value,
      },
    })

    router.back()
  },
  null,
  { immediate: false }
)

const { execute: updateAccount } = useAsyncState(
  async () => {
    await apiClient.account.verwaltungPatch.mutate({
      id: props.account!.id,
      data: {
        email: accountForm.value.email,
        role: accountForm.value.roleId as RouterInput['account']['verwaltungPatch']['data']['role'],
      },
    })

    props.onUpdate?.()
  },
  null,
  { immediate: false }
)

const {
  execute: updatePassword,
  error: errorPassword,
  isLoading: isLoadingPassword,
} = useAsyncState(
  async () => {
    if (!props.account) {
      return
    }

    await apiClient.account.changePassword.mutate({
      ...password.value,
      id: props.account.id,
    })

    props.onUpdate?.()
  },
  null,
  { immediate: false }
)

const {
  execute: deleteUser,
  error: errorDelete,
  isLoading: isLoadingDelete,
} = useAsyncState(
  async () => {
    if (!props.account) {
      return
    }

    await apiClient.person.verwaltungRemove.mutate({ id: props.account.id })
    router.back()
  },
  null,
  { immediate: false }
)

const handle = async () => {
  if (edit.value) {
    await updateAccount()
  } else {
    await createAccount()
  }
}
</script>

<template>
  <div v-if="!edit">
    <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
    <Stammdaten v-model="stammdatenForm" />
  </div>

  <h2 class="text-base font-semibold leading-7 mt-10">Accountdaten</h2>
  <ValidateForm
    class="mt-5"
    @submit="handle"
  >
    <div class="grid grid-flow-row lg:grid-cols-2 gap-5">
      <BasicInput
        id="accountEmail"
        v-model="accountForm.email"
        label="E-Mail Adresse"
        placeholder="E-Mail eingeben"
        required
      />
      <BasicPassword
        v-if="!edit"
        id="accountPassword"
        v-model="accountForm.password"
        label="Passwort"
        placeholder="Passwort eingeben"
        required
      />
      <BasicSelect
        id="accountRole"
        v-model="accountForm.roleId"
        required
        label="Rolle"
        :options="roles"
      />
      <BasicCheckbox
        id="accountActivate"
        v-model="accountForm.isActiv"
        label="Account aktivieren"
      />
    </div>

    <div class="flex flex-row items-center mt-8">
      <Button
        color="primary"
        class="w-full lg:w-auto justify-center items-center space-x-2"
        :disabled="isLoadingCreate"
        type="submit"
      >
        <template v-if="isLoadingCreate">
          <Loading color="white" />
        </template>
        <span>Speichern</span>
      </Button>
      <div class="text-danger-500 text-right">
        <template v-if="errorCreate">
          {{ errorCreate }}
        </template>
      </div>
    </div>
  </ValidateForm>

  <div
    v-if="edit"
    class="mt-10"
  >
    <h2 class="text-base font-semibold leading-7">Passwort</h2>
    <p class="mt-1 text-sm leading-6 text-gray-500">Hier kann das Passwort des Accounts geändert werden.</p>

    <div class="md:col-span-2">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
        <div
          v-if="isSelf"
          class="col-span-full"
        >
          <BasicPassword
            v-model="password.password_old"
            label="Aktuelles Passwort"
            required
          />
        </div>

        <div class="col-span-full">
          <BasicPassword
            v-model="password.password"
            label="Neues Passwort"
            required
          />
        </div>

        <div class="col-span-full">
          <BasicPassword
            v-model="password.password_confirm"
            label="Passwort bestätigen"
            required
          />
        </div>

        <div class="col-span-6">
          <PasswordStrength
            ref="passwordStrength"
            :password="password.password"
          />
        </div>
      </div>

      <div class="mt-8 flex gap-4">
        <Button
          color="warning"
          :disabled="isLoadingPassword"
          @click="updatePassword"
        >
          Passwort ändern
        </Button>
      </div>

      <div
        v-if="errorPassword"
        class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
      >
        {{ errorPassword }}
      </div>
    </div>

    <div
      v-if="edit"
      class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      <div>
        <h2 class="text-base font-semibold leading-7">Account löschen</h2>
        <p class="mt-1 text-sm leading-6 text-gray-500">
          Du benötigst diesen Account nicht mehr? Hier kannst Du das Konto löschen. Dieser Vorgang ist nicht rückgängig
          zu machen. Alle Informationen, die mit diesem Konto verbunden sind, werden dauerhaft gelöscht.
        </p>
      </div>

      <div class="flex items-start md:col-span-2">
        <Button
          v-if="!isSelf"
          color="danger"
          :disabled="isLoadingDelete"
          @click="deleteUser"
        >
          Ja, diesen Account löschen
        </Button>
        <p
          v-else
          class="text-danger-500 font-semibold"
        >
          Deinen eigenen Account kannst du nicht löschen.
        </p>

        <div
          v-if="errorDelete"
          class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
        >
          {{ errorDelete }}
        </div>
      </div>
    </div>
  </div>
</template>
