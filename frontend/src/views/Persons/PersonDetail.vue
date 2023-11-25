<script setup lang="ts">
import { ArrowLeftIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import FormPersonGeneral from '@/components/forms/person/FormPersonGeneral.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount, logout } from '@/composables/useAuthentication'
import personProfileImage from '@/helpers/personProfileImage'
import router from '@/router'

const secondaryNavigation = [{ name: 'Account', href: '#', current: true }]

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
    await router.push({ name: 'Users' })
  },
  null,
  { immediate: false }
)
</script>

<template>
  <header class="border-b border-white/5">
    <!-- Secondary navigation -->
    <nav class="flex overflow-x-auto py-4">
      <ul
        role="list"
        class="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
      >
        <li class="text-gray-600">
          <router-link
            :to="{ name: 'Users' }"
            class="flex flex-row items-center gap-2"
          >
            <ArrowLeftIcon class="h-4 w-4" />
            <span>Zurück</span>
          </router-link>
        </li>
        <li
          v-for="item in secondaryNavigation"
          :key="item.name"
        >
          <a
            :href="item.href"
            :class="item.current ? 'border-b-2 border-indigo-500 text-indigo-500' : ''"
            >{{ item.name }}</a
          >
        </li>
      </ul>
    </nav>
  </header>

  <!-- Settings forms -->
  <div class="divide-y divide-white/5">
    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Profil Informationen</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">Hier kannst du das Nutzerprofil bearbeiten.</p>
        <img
          :src="personProfileImage(person, 512)"
          class="mt-12 h-64 w-64 flex-none rounded-full border-4 border-gray-800 bg-gray-800 object-cover"
        />
      </div>

      <FormPersonGeneral
        v-if="person !== null"
        :person="person"
        :is-self="isSelf"
        class="md:col-span-2"
        mode="update"
        @update="() => fetchUser()"
      />
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Passwort ändern</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">Hier kann das Passwort des Accounts geändert werden.</p>
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
        </div>

        <div class="mt-8 flex gap-4">
          <Button
            color="primary"
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
    </div>

    <div class="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 class="text-base font-semibold leading-7">Account löschen</h2>
        <p class="mt-1 text-sm leading-6 text-gray-400">
          Du benötigst diesen Account nicht mehr? Hier kannst Du das Konto löschen. Dieser Vorgang ist nicht rückgängig
          zu machen. Alle Informationen, die mit diesem Konto verbunden sind, werden dauerhaft gelöscht.
        </p>
      </div>

      <div class="flex items-start md:col-span-2">
        <Button
          v-if="!isSelf"
          color="danger"
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
