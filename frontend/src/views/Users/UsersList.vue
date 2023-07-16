<template>
  <div class="px-4 sm:px-6 lg:px-8">
    <div class="sm:flex sm:items-center">
      <div class="sm:flex-auto">
        <h1 class="text-base font-semibold leading-6 text-gray-900">Benutzer</h1>
        <p class="mt-2 text-sm text-gray-700">Liste aller Benutzer die Zugriff auf dieses System haben.</p>
      </div>
      <div class="mt-4 flex flex-row gap-4">
        <Button color="primary">Hinzufügen</Button>
        <Button
          color="secondary"
          @click="fetchUsers"
        >
          <ArrowPathIcon class="h-6 w-6" />
        </Button>
      </div>
    </div>
    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Title
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Rolle
                </th>
                <th
                  scope="col"
                  class="relative py-3.5 pl-3 pr-4 sm:pr-0"
                >
                  <span class="sr-only">Bearbeiten</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr
                v-for="user in userList"
                :key="user.id"
                class="odd:bg-gray-50"
              >
                <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                  <div class="flex items-center">
                    <div class="h-11 w-11 flex-shrink-0">
                      <img
                        class="h-11 w-11 rounded-full"
                        :src="userProfileImage(user)"
                        alt=""
                      />
                    </div>
                    <div class="ml-4">
                      <div class="font-medium text-gray-900">{{ user.firstname }} {{ user.lastname }}</div>
                      <div class="mt-1 text-gray-500">{{ user.email }}</div>
                    </div>
                    <Badge
                      v-if="user.id === currentUser?.id"
                      class="ml-4"
                      >Du</Badge
                    >
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <div class="text-gray-900">Arbeitsbereich</div>
                  <div class="mt-1 text-gray-500">Zusatzinfo</div>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                  <span
                    class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20"
                  >
                    Active
                  </span>
                </td>
                <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ user.role }}</td>
                <td class="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                  <router-link
                    :to="{ name: 'UserDetail', params: { userId: user.id } }"
                    class="text-green-600 hover:text-green-900"
                  >
                    Bearbeiten
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import userProfileImage from '@/helpers/userProfileImage'
import { apiClient } from '../../api'
import Button from '@/components/Button.vue'
import Badge from '@/components/Badge.vue'
import useAuthentication from '@/composables/useAuthentication'
import { ArrowPathIcon } from '@heroicons/vue/24/outline'

const { user: currentUser } = useAuthentication()
const { state: userList, execute: fetchUsers } = useAsyncState(async () => {
  const result = await apiClient.user.list.query()
  return result
}, [])

fetchUsers()
</script>
