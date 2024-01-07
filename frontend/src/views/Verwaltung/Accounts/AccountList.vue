<script setup lang="ts">
import { CheckIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'

import { apiClient } from '@/api'
import router from '@/router'
import { roleMapping } from '@codeanker/api/src/enumMappings'
import { formatDate } from '@codeanker/helpers'

const { state: accountList, execute: fetchAccounts } = useAsyncState(async () => {
  const result = await apiClient.account.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
  return result
}, [])

fetchAccounts()
</script>

<template>
  <h5>Accounts</h5>

  <div class="flow-root">
    <p class="mt-8 text-sm text-gray-500">Mit einem Account können sich Personen in der Verwaltung anmelden.</p>

    <RouterLink
      class="text-primary-600"
      :to="{ name: 'Verwaltung Account erstellen' }"
    >
      Account anlegen
    </RouterLink>

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
            Aktiviert
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
            {{ roleMapping[account.role].human }}
          </td>
          <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
            <div
              v-if="account.activatedAt"
              class="flex items-center"
            >
              <CheckIcon class="text-primary-600 h-5 w-5" />{{ formatDate(account.activatedAt) }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
