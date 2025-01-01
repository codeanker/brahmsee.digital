<script setup lang="ts">
import { PlusIcon, UsersIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import DataGridDoubleLineCell from '@/components/DataGridDoubleLineCell.vue'
import GenericDataGrid from '@/components/GenericDataGrid.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import { getAccountStatusColor } from '@/helpers/getAccountStatusColors'
import router from '@/router'
import { type RouterInput, type RouterOutput } from '@codeanker/api'
import { type TGridColumn } from '@codeanker/datagrid'
import { dayjs } from '@codeanker/helpers'

const { setTitle } = useRouteTitle()
setTitle('Personen')

const tabs = [{ name: 'Personen', icon: UsersIcon }]

/// Typen von den Daten, Filter und Sortierung
type TData = Awaited<RouterOutput['person']['list']>[number]
type TFilter = RouterInput['person']['list']['filter']
type TOrderBy = RouterInput['person']['list']['orderBy']

const columns: TGridColumn<TData, TFilter>[] = [
  {
    field: 'firstname',
    title: 'Name',
    sortable: true,
    format: (value, row) => `${row.firstname} ${row.lastname}`,
  },
  {
    field: 'birthday',
    title: 'Alter',
    preset: 'date',
    cell: DataGridDoubleLineCell,
    cellProps: (formattedValue, row) => {
      return {
        title: `${dayjs().diff(row.birthday, 'year')} Jahre`,
        message: formattedValue.value,
      }
    },
    sortable: true,
  },
  {
    field: 'gliederung.name',
    title: 'Gliederung',
    sortable: true,
  },
  {
    field: 'person.account.activatedAt',
    title: 'Account',
    cell: Badge,
    preset: 'date',
    cellProps: (formattedValue, row) => {
      return {
        color: getAccountStatusColor(row.content.account?.status),
        title: formattedValue.value,
        text: row.content.account?.status,
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
  return apiClient.person.list.query({
    filter: filter,
    orderBy: orderBy,
    pagination: pagination,
  })
}
async function fetchCount(filter: TFilter): Promise<number> {
  return apiClient.person.count.query({
    filter: filter,
  })
}
</script>

<template>
  <div class="flow-root">
    <Tabs
      content-space="4"
      :tabs="tabs"
    >
      <Tab>
        <div class="my-4 flex justify-between">
          <p class="max-w-2xl text-sm">Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.</p>

          <RouterLink
            class="text-primary-500 flex items-center"
            :to="{ name: 'Verwaltung Person erstellen' }"
          >
            <PlusIcon class="h-5 w-5 mr-1" />
            Person anlegen
          </RouterLink>
        </div>

        <div class="w-full h-[80vh]">
          <GenericDataGrid
            :columns="columns"
            :fetch-page="fetchPage"
            :fetch-count="fetchCount"
            :default-filter="{
              name: '',
              gliederungName: '',
            }"
            :default-order-by="[]"
            no-data-message="Es gibt bisher keine Personen."
            show-clickable
            @row-click="(person) => router.push({ name: 'Verwaltung Persondetails', params: { personId: person.id } })"
          />
        </div>
      </Tab>
    </Tabs>
  </div>
</template>
