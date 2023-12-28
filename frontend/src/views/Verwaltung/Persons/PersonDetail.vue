<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import FormPersonGeneral from '@/components/forms/person/FormPersonGeneral.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount, logout } from '@/composables/useAuthentication'

const isSelf = ref(false)
const password = ref({
  password_old: '',
  password: '',
  password_confirm: '',
  id: loggedInAccount.value!.id,
})

const route = useRoute()
const { state: person, execute: fetchUser } = useAsyncState(async () => {
  const personId = route.params.personId as string
  const result = await apiClient.person.verwaltungGet.query({ id: parseInt(personId) })
  isSelf.value = result?.id === loggedInAccount.value?.id
  return result
}, null)

const { execute: updatePassword, error: errorPassword } = useAsyncState(
  async () => {
    // @todo
    // await apiClient.person.changePassword.mutate({ password: password.value })
    logout()
  },
  null,
  { immediate: false }
)

const { execute: deleteUser, error: errorDelete } = useAsyncState(
  async () => {
    await apiClient.person.verwaltungRemove.mutate({ id: person.value!.id })
  },
  null,
  { immediate: false }
)
</script>

<template>
  <h5>Person: {{ person?.firstname }} {{ person?.lastname }}</h5>

  <div class="mt-10">
    <h2 class="text-base font-semibold leading-7">Stammdaten</h2>
    <FormPersonGeneral
      v-if="person !== null"
      :person="person"
      :is-self="isSelf"
      class="md:col-span-2"
      mode="update"
      @update="() => fetchUser()"
    />
  </div>

  <div class="mt-10">
    <h2 class="text-base font-semibold leading-7">Passwort ändern</h2>
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
      </div>

      <div class="mt-8 flex gap-4">
        <Button
          color="primary"
          :disabled="true"
          @click="updatePassword"
        >
          Speichern
        </Button>
      </div>

      <div
        v-if="errorPassword"
        class="bg-danger-400 mb-2 mt-5 rounded p-3 text-center text-white"
      >
        {{ errorPassword }}
      </div>
    </div>

    <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
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
          :disabled="true"
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
