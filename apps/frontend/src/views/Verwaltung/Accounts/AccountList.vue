<script setup lang="ts">
import { FingerPrintIcon, PlusIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import DataGridDoubleLineCell from '@/components/DataGridDoubleLineCell.vue'
import GenericDataGrid from '@/components/GenericDataGrid.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { getAccountStatusColor } from '@/helpers/getAccountStatusColors'
import router from '@/router'
import { roleMapping } from '@codeanker/api'
import { type RouterInput, type RouterOutput } from '@codeanker/api'
import { type TGridColumn } from '@codeanker/datagrid'

const { setTitle } = useRouteTitle()
setTitle('Accounts')

const { state: totalAccountRequest } = useAsyncState(
  async () => {
    return await apiClient.account.verwaltungCount.query({
      filter: {
        status: 'OFFEN',
      },
    })
  },
  0,
  {
    immediate: true,
  }
)

const tabs = computed(() => [
  { name: 'Accounts', icon: FingerPrintIcon },
  { name: 'Account Anfragen', icon: UserIcon, count: totalAccountRequest.value },
])

/// Typen von den Daten, Filter und Sortierung
type TData = Awaited<RouterOutput['account']['verwaltungList']>[number]
type TFilter = RouterInput['account']['verwaltungList']['filter']
type TOrderBy = RouterInput['account']['verwaltungList']['orderBy']

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'person.photoId',
    title: ' ',
    size: '78px',
    cell: defineAsyncComponent(() => import('@/components/UIComponents/UserLogo.vue')),
    cellProps: (formattedValue, row) => {
      return {
        firstname: row.content.person.firstname,
        lastname: row.content.person.lastname,
        photoId: row.content.person.photoId,
        personId: row.content.personId,
        cssClasses: 'h-10 w-10',
      }
    },
  },
  {
    field: 'person.firstname',
    title: 'Name',
    sortable: true,
    format: (value, row) => `${row.person.firstname} ${row.person.lastname}`,
    filter: { component: BasicInput, key: 'personName' },
  },
  {
    field: 'email',
    title: 'E-Mail Adresse',
    sortable: true,
  },
  {
    field: 'role',
    title: 'Rolle',
    sortable: true,
    format: (value) => {
      return roleMapping[value].human
    },
    cell: DataGridDoubleLineCell,
    cellProps: (formattedValue, row) => {
      let message = ''
      if (
        row.content.role === 'GLIEDERUNG_ADMIN' &&
        row.content.GliederungToAccount.length > 0 &&
        row.content.GliederungToAccount[0].gliederung &&
        row.content.GliederungToAccount[0].gliederung.name
      ) {
        message = row.content.GliederungToAccount[0].gliederung.name
      }
      return {
        title: formattedValue.value,
        message,
      }
    },
  },
  {
    field: 'status',
    title: 'Status',
    sortable: true,
    cell: Badge,
    cellProps: (formattedValue) => {
      return {
        color: getAccountStatusColor(formattedValue.value),
        title: formattedValue.value,
        text: formattedValue.value,
      }
    },
  },
]

async function fetchPage(
  pagination: {
    take: number
    skip: number
  },
  filter: TFilter,
  orderBy: TOrderBy
): Promise<TData[]> {
  return apiClient.account.verwaltungList.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}
async function fetchCount(filter: TFilter): Promise<number> {
  return apiClient.account.verwaltungCount.query({
    filter: filter,
  })
}

const route = useRoute()
const tabIndex = ref(parseInt(route.query.tab as string) ?? 0)
const defaultFilter = computed(() => {
  const baseFilter = {
    personName: '',
    email: '',
    status: undefined as TData['status'] | undefined,
  }
  if (tabIndex.value === 1) {
    baseFilter.status = 'OFFEN'
  }
  return baseFilter
})

function changeTab(index: number) {
  tabIndex.value = index
}
</script>

<template>
  <div>
    <div class="flow-root">
      <Tabs
        content-space="4"
        :tabs="tabs"
        @change-tab-index="changeTab"
      >
        <Tab :full-width="true">
          <div class="my-8 flex justify-between">
            <div>
              <p class="max-w-2xl text-sm">
                Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.
              </p>
            </div>
            <RouterLink
              class="text-primary-500 flex items-center"
              :to="{ name: 'Verwaltung Account erstellen' }"
            >
              <PlusIcon class="h-5 w-5 mr-1" />
              Account anlegen
            </RouterLink>
          </div>
          <div class="grid-rows[1fr, 50px] grid flex-grow">
            <GenericDataGrid
              :columns="columns"
              :fetch-page="fetchPage"
              :fetch-count="fetchCount"
              :default-filter="defaultFilter"
              :default-order-by="[]"
              no-data-message="Es gibt bisher keine Accounts."
              show-clickable
              @row-click="
                (account) => router.push({ name: 'Verwaltung Accountdetails', params: { accountId: account.id } })
              "
            />
          </div>
        </Tab>
        <Tab :full-width="true">
          <div class="my-8 flex justify-between">
            <div>
              <p class="max-w-2xl text-sm">
                Hier findest Du alle Personen sich registriert haben und noch bestätigt werden müssen.
              </p>
            </div>
          </div>
          <GenericDataGrid
            :columns="columns"
            :fetch-page="fetchPage"
            :fetch-count="fetchCount"
            :default-filter="defaultFilter"
            :default-order-by="[]"
            no-data-message="Es gibt keine offenen Account anfragen."
            show-clickable
            @row-click="
              (account) => router.push({ name: 'Verwaltung Accountdetails', params: { accountId: account.id } })
            "
          />
        </Tab>
      </Tabs>
    </div>
  </div>
</template>
