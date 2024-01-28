<script setup lang="ts">
import { PlusIcon, UsersIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAccountStatusColor } from '@/helpers/getAccountStatusColors'
import router from '@/router'
import { dayjs, formatDate } from '@codeanker/helpers'

const { state: personList } = useAsyncState(
  async () => {
    if (loggedInAccount.value?.role === 'ADMIN') {
      return await apiClient.person.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
    }
  },
  [],
  { immediate: true }
)

const tabs = [{ name: 'Personen', icon: UsersIcon }]
</script>

<template>
  <h5>Personen</h5>
  <div class="flow-root">
    <Tabs
      class="mt-5 lg:mt-10"
      content-space="4"
      :tabs="tabs"
    >
      <Tab>
        <div class="my-10 flex justify-between">
          <div>
            <div class="text-lg font-semibold text-gray-900">Personen</div>
            <p class="max-w-2xl text-sm text-gray-500">
              Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.
            </p>
          </div>

          <RouterLink
            class="text-primary-600 flex items-center"
            :to="{ name: 'Verwaltung Person erstellen' }"
          >
            <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
            Person anlegen
          </RouterLink>
        </div>

        <table class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                Name
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Alter
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Gliederung
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Account
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="person in personList"
              :key="person.id"
              class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
              :title="person.firstname + ' ' + person.lastname + ' bearbeiten'"
              @click="router.push({ name: 'Verwaltung Persondetails', params: { personId: person.id } })"
            >
              <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div class="text-gray-900">{{ person.firstname }} {{ person.lastname }}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <div v-if="person.birthday">
                  {{ dayjs().diff(person.birthday, 'year') }} Jahre
                  <br />
                  {{ formatDate(person.birthday) }}
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                {{ person.gliederung?.name }}
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <div class="flex items-center">
                  <Badge
                    v-if="person.account"
                    :color="getAccountStatusColor(person.account.status)"
                    :title="formatDate(person.account.activatedAt)"
                    >{{ person.account.status }}</Badge
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </Tab>
    </Tabs>
  </div>
</template>
