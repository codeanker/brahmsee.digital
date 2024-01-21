<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { FingerPrintIcon, KeyIcon, TrashIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import type { IStammdaten } from '../anmeldung/Stammdaten.vue'
import Stammdaten from '../anmeldung/Stammdaten.vue'

import { apiClient } from '@/api'
import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import PasswordStrength from '@/components/PasswordStrength.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getStatusColor } from '@/helpers/getStatusColors'
import router from '@/router'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { AccountStatusMapping, getEnumOptions, roleMapping } from '@codeanker/api/src/enumMappings'
import { formatDate } from '@codeanker/helpers'
import { ValidateForm } from '@codeanker/validation'

type Account = Awaited<RouterOutput['account']['verwaltungGet']>

const props = defineProps<{
  account?: Account
  onUpdate?: () => void
}>()

const isSelf = computed(() => props.account?.id === loggedInAccount.value?.id)
const edit = computed(() => props.account !== undefined)

const stammdatenForm = ref<IStammdaten>({
  firstname: props.account?.person?.firstname ?? '',
  lastname: props.account?.person?.lastname ?? '',
})
const accountForm = ref({
  email: props.account?.email ?? '',
  password: '',
  roleId: props.account?.role ?? '',
  status: props.account?.status,
})

const roles = getEnumOptions(roleMapping)
const statusOptions = getEnumOptions(AccountStatusMapping)
const getStatusHuman = computed(() => statusOptions.find((status) => status.value === accountForm.value.status)?.label)

const password = ref({
  password_old: '',
  password: '',
  password_confirm: '',
})

const passwordStrength = ref()

const deleteAccount = ref()

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

const { execute: deleteUser, error: errorDelete } = useAsyncState(
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

function requestEmailConfirmation() {
  if (!props.account) {
    return
  }
  apiClient.account.emailConfirmRequest.mutate({ accountId: props.account.id })
}

const tabs = computed(() => {
  let tabs = [{ name: 'Allgemein', icon: FingerPrintIcon }]
  if (edit.value) tabs.push({ name: 'Sicherheit', icon: KeyIcon })
  if (!isSelf.value && edit.value) tabs.push({ name: 'Account löschen', icon: TrashIcon })
  return tabs
})
</script>

<template>
  <div class="bg-white pt-2 pb-8">
    <div class="flex items-center justify-between">
      <div class="mx-auto max-w-xl lg:mx-0">
        <h2 class="mt-2 text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          <span>{{ stammdatenForm?.firstname }} {{ stammdatenForm?.lastname }}</span>
        </h2>
        <p class="mt-2 text-md leading-6 text-gray-600">
          Bearbeite die Accountdaten, Accounts sind Personen zugeordnet.
        </p>
      </div>
      <Badge
        v-if="edit && props?.account?.status"
        :color="getStatusColor(props.account.status)"
        :title="formatDate(props.account.activatedAt)"
        >{{ props.account.status }}</Badge
      >
    </div>
  </div>
  <Tabs
    content-space="4"
    :tabs="tabs"
  >
    <Tab>
      <div
        v-if="!edit"
        class="my-10"
      >
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
          <BasicDropdown
            :right="false"
            :append="true"
            class="w-full"
            label="Status"
            required
            button-style="w-full text-left"
          >
            <template #buttonContent>
              <button
                type="button"
                class="input-style w-full block text-left flex justify-between items-center"
              >
                <slot>
                  <div class="flex space-x-2 items-center">
                    <div
                      class="w-4 h-4 rounded-full"
                      :class="`bg-${getStatusColor(accountForm.status)}-600`"
                    ></div>
                    <span>{{ getStatusHuman }}</span>
                  </div>
                </slot>
                <ChevronDownIcon class="h-5 text-gray-500" />
              </button>
            </template>
            <template #dropdownContent>
              <MenuItem
                as="div"
                class=""
              >
                <button
                  v-for="status in statusOptions"
                  :key="status.value"
                  type="button"
                  class="hover:bg-primary-light rounded items-center flex p-2 w-full space-x-2 text-left"
                  @click="accountForm.status = status.value"
                >
                  <div
                    class="w-4 h-4 rounded-full"
                    :class="`bg-${getStatusColor(status.value)}-600`"
                  ></div>
                  <span>{{ status.label }}</span>
                </button>
              </MenuItem>
            </template>
          </BasicDropdown>
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
    </Tab>
    <Tab>
      <div
        v-if="edit"
        class="my-10"
      >
        <div>
          <h2 class="text-base font-semibold leading-7">Passwort</h2>
        </div>

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
            class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center"
          >
            {{ errorPassword }}
          </div>
        </div>
      </div>
    </Tab>
    <Tab>
      <div
        v-if="!isSelf && edit"
        class="p-6 border-2 border-danger-600 rounded-md my-8 flex items-top space-x-4"
      >
        <div><TrashIcon class="h-10 w-10 text-danger-600"></TrashIcon></div>
        <div>
          <div class="font-bold text-lg text-danger-600">Account löschen</div>
          <div>
            Du benötigst diesen Account nicht mehr? Hier kannst Du das Konto löschen. Dieser Vorgang ist nicht
            rückgängig zu machen. Alle Informationen, die mit diesem Konto verbunden sind, werden dauerhaft gelöscht.
          </div>
          <div class="flex mt-4">
            <input
              v-model="deleteAccount"
              type="text"
              class="form-control rounded-r-none focus:border-danger-600"
              placeholder="Account löschen"
            />
            <Button
              class="p-2 rounded-l-none"
              color="danger"
              :disabled="deleteAccount !== 'Account löschen'"
              @click="deleteUser"
            >
              Löschen
            </Button>
          </div>
        </div>
        <template v-if="errorDelete">
          {{ errorDelete }}
        </template>
      </div>
    </Tab>
  </Tabs>

  <Button
    v-if="account"
    color="primary"
    class="w-full lg:w-auto justify-center items-center space-x-2 mt-4"
    type="button"
    @click="requestEmailConfirmation"
    >E-Mail bestätigung anfordern</Button
  >
</template>
