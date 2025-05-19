<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import {
  FingerPrintIcon,
  KeyIcon,
  TrashIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  CodeBracketIcon,
} from '@heroicons/vue/24/outline'
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
import { getAccountStatusColor } from '@/helpers/getAccountStatusColors'
import router from '@/router'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { AccountStatusMapping, getEnumOptions, roleMapping } from '@codeanker/api'
import { formatDate } from '@codeanker/helpers'
import { ValidateForm } from '@codeanker/validation'

type Account = RouterOutput['account']['verwaltungGet']

const props = defineProps<{
  account?: Account
  onUpdate?: () => void
}>()

const isSelf = computed(() => props.account?.id === loggedInAccount.value?.id)
const edit = computed(() => props.account !== undefined)

const stammdatenForm = ref<IStammdaten>({
  firstname: props.account?.person?.firstname ?? '',
  lastname: props.account?.person?.lastname ?? '',
  birthday: props.account?.person?.birthday ?? null,
  gender: props.account?.person?.gender ?? 'MALE',
})
const accountForm = ref({
  email: props.account?.email ?? '',
  password: '',
  roleId: props.account?.role ?? '',
  status: props.account?.status,
})

const roles = getEnumOptions(roleMapping)
const statusOptions = getEnumOptions(AccountStatusMapping)

const availableOptions = statusOptions.filter((option) => option.value === 'DEAKTIVIERT' || option.value === 'AKTIV')

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
        status: accountForm.value.status as RouterInput['account']['verwaltungPatch']['data']['status'],
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

    await apiClient.account.verwaltungRemove.mutate({ id: props.account.id })
    router.push({ name: 'Verwaltung Accounts' })
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

const tabs = computed(() => {
  const tabs = [{ name: 'Allgemein', icon: FingerPrintIcon }]
  if (edit.value) tabs.push({ name: 'Sicherheit', icon: KeyIcon })
  if (!isSelf.value && edit.value) tabs.push({ name: 'Account löschen', icon: TrashIcon })
  if (loggedInAccount.value?.role === 'ADMIN') tabs.push({ name: 'Entwickler:in', icon: CodeBracketIcon })
  return tabs
})
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <div class="mx-auto max-w-xl lg:mx-0">
      <div class="flex items-center space-x-3 mb-1">
        <h2 class="text-xl font-bold tracking-tight sm:text-2xl mb-0">
          <span>{{ stammdatenForm?.firstname }} {{ stammdatenForm?.lastname }}</span>
        </h2>
        <Badge
          v-if="edit && props?.account?.status"
          :color="getAccountStatusColor(props.account.status)"
          :title="formatDate(props.account.activatedAt)"
        >
          {{ props.account.status }}
        </Badge>
      </div>
      <p class="text-md">Bearbeite die Accountdaten, Accounts sind Personen zugeordnet.</p>
    </div>
  </div>
  <Tabs
    content-space="4"
    :tabs="tabs"
  >
    <Tab>
      <div
        v-if="!edit"
        class="mb-6"
      >
        <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
        <Stammdaten v-model="stammdatenForm" />
      </div>

      <ValidateForm @submit="handle">
        <h2 class="text-base font-semibold">Accountdaten</h2>
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
                class="input-style w-full text-left !flex justify-between items-center"
              >
                <slot>
                  <div class="flex space-x-2 items-center">
                    <div
                      class="w-4 h-4 rounded-full"
                      :class="`bg-${getAccountStatusColor(accountForm.status)}-600`"
                    />
                    <span>{{ getStatusHuman }}</span>
                  </div>
                  <ChevronDownIcon class="h-5 text-gray-500" />
                </slot>
              </button>
            </template>
            <template #dropdownContent>
              <MenuItem
                as="div"
                class=""
              >
                <button
                  v-for="status in availableOptions"
                  :key="status.value"
                  type="button"
                  class="hover:bg-primary-light rounded items-center flex p-2 w-full space-x-2 text-left"
                  @click="accountForm.status = status.value"
                >
                  <div
                    class="w-4 h-4 rounded-full"
                    :class="`bg-${getAccountStatusColor(status.value)}-600`"
                  />
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
        class="grid grid-cols-1 lg:grid-cols-2"
      >
        <div v-if="!account?.dlrgOauthId">
          <h2 class="text-base font-semibold">Passwort</h2>
          <div class="grid grid-cols-1 gap-y-6">
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
              color="primary"
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

        <div
          v-if="account?.dlrgOauthId"
          class="rounded-md bg-blue-50 p-4"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <CheckCircleIcon
                class="h-5 w-5 text-blue-400"
                aria-hidden="true"
              />
            </div>
            <div class="ml-3 flex-1 md:flex md:justify-between">
              <p class="text-sm text-blue-700 mb-0">
                Die Person hat sich via OAuth über das ISC angemeldet. Daher kann das Passwort nicht geändert werden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Tab>
    <Tab>
      <div
        v-if="!isSelf && edit"
        class="p-6 border border-danger-600 rounded-md my-8 flex items-top space-x-4"
      >
        <TrashIcon class="size-8 shrink-0 text-danger-600 mt-1" />
        <div class="space-y-3">
          <div class="font-bold text-lg text-danger-600">Account löschen</div>
          <div>
            Du benötigst diesen Account nicht mehr? Hier kannst du ihn löschen. Dieser Vorgang ist endgültig. Alle
            Informationen werden gelöscht.
          </div>
          <div>Gebe den Text <span class="font-bold">Account löschen</span> ein, um den Account zu löschen.</div>
          <div class="flex">
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
    <Tab v-if="loggedInAccount?.role === 'ADMIN'">
      <div class="text-lg font-semibold">Entwickler:innen</div>
      <p class="max-w-2xl text-sm mb-6">Informationen für Entwickler:innen</p>
      <pre>{{ stammdatenForm }}</pre>
    </Tab>
  </Tabs>
</template>
