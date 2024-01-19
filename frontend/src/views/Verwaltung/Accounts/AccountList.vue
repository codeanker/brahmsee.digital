<script setup lang="ts">
import { FingerPrintIcon, PlusIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'

import { apiClient } from '@/api'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { getStatusColor } from '@/helpers/getStatusColors'
import router from '@/router'
import { roleMapping } from '@codeanker/api/src/enumMappings'
import { formatDate } from '@codeanker/helpers'

const { state: accountList } = useAsyncState(
  async () => {
    const result = await apiClient.account.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
    return result
  },
  [],
  {
    immediate: true,
  }
)

const accountRequest = computed(() => {
  return accountList.value?.filter((account) => account.status === 'OPEN')
})

const tabs = computed(() => [
  { name: 'Accounts', icon: FingerPrintIcon },
  { name: 'Account Anfragen', icon: UserIcon, count: accountRequest.value.length },
])
</script>

<template>
  <h5>Accounts</h5>

  <div class="flow-root">
    <Tabs
      class="mt-10"
      content-space="4"
      :tabs="tabs"
    >
      <Tab>
        <div class="my-10 flex justify-between">
          <div>
            <div class="text-lg font-semibold text-gray-900">Accounts</div>
            <p class="max-w-2xl text-sm text-gray-500">
              Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.
            </p>
          </div>
          <RouterLink
            class="text-primary-600 flex items-center"
            :to="{ name: 'Verwaltung Account erstellen' }"
          >
            <PlusIcon class="h-5 w-5 mr-1"></PlusIcon>
            Account anlegen
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
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                E-Mail Adresse
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Rolle
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="account in accountList"
              :key="account.id"
              class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
              :title="account.email + ' bearbeiten'"
              @click="router.push({ name: 'Verwaltung Accountdetails', params: { accountId: account.id } })"
            >
              <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <span>{{ account.person.firstname }} {{ account.person.lastname }}</span>
              </td>
              <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div class="text-gray-900">{{ account.email }}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                {{ roleMapping[account.role].human }}<br />
                <span
                  v-if="
                    account.role === 'GLIEDERUNG_ADMIN' &&
                    account.GliederungToAccount.length > 0 &&
                    account.GliederungToAccount[0].gliederung &&
                    account.GliederungToAccount[0].gliederung.name
                  "
                  class="text-xs"
                  >{{ account.GliederungToAccount[0].gliederung.name }}</span
                >
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <Badge
                  :color="getStatusColor(account.status)"
                  :title="formatDate(account.activatedAt)"
                  >{{ account.status }}</Badge
                >
              </td>
            </tr>
          </tbody>
        </table>
      </Tab>
      <Tab>
        <div class="my-10 flex justify-between">
          <div>
            <div class="text-lg font-semibold text-gray-900">Accounts</div>
            <p class="max-w-2xl text-sm text-gray-500">
              Hier findest Du alle Personen sich registriert haben und noch bestätigt werden müssen.
            </p>
          </div>
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
                class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
              >
                E-Mail Adresse
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Rolle
              </th>
              <th
                scope="col"
                class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr
              v-for="account in accountRequest"
              :key="account.id"
              class="cursor-pointer even:bg-gray-50 hover:bg-gray-100"
              :title="account.email + ' bearbeiten'"
              @click="router.push({ name: 'Verwaltung Accountdetails', params: { accountId: account.id } })"
            >
              <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <span>{{ account.person.firstname }} {{ account.person.lastname }}</span>
              </td>
              <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                <div class="text-gray-900">{{ account.email }}</div>
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                {{ roleMapping[account.role].human }}<br />
                <span
                  v-if="
                    account.role === 'GLIEDERUNG_ADMIN' &&
                    account.GliederungToAccount.length > 0 &&
                    account.GliederungToAccount[0].gliederung &&
                    account.GliederungToAccount[0].gliederung.name
                  "
                  class="text-xs"
                  >{{ account.GliederungToAccount[0].gliederung.name }}</span
                >
              </td>
              <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                <Badge :color="getStatusColor(account.status)">{{ account.status }}</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </Tab>
    </Tabs>
  </div>
</template>
