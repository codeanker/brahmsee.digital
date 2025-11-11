<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'

import { apiClient } from '@/api'
import DataTable, { type Query } from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import Badge from '@/components/UIComponents/Badge.vue'
import UserLogo from '@/components/UIComponents/UserLogo.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import type { StatusColors } from '@/helpers/getAccountStatusColors'
import { type AccountStatus, AccountStatusMapping, type Role, roleMapping, type RouterOutput } from '@codeanker/api'
import { formatTimestamp } from '@codeanker/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'
import { useRouter } from 'vue-router'

const { setTitle } = useRouteTitle()
setTitle('Accounts')

type Account = RouterOutput['account']['verwaltungList']['data'][number]

const roleColors: Record<Role, StatusColors> = {
  ADMIN: 'danger',
  GLIEDERUNG_ADMIN: 'warning',
  USER: 'muted',
}
const statusColors: Record<AccountStatus, StatusColors> = {
  AKTIV: 'primary',
  DEAKTIVIERT: 'danger',
  OFFEN: 'muted',
}

const column = createColumnHelper<Account>()
const columns = [
  column.accessor('person.photoId', {
    size: 10,
    header: 'Foto',
    enableColumnFilter: false,
    cell({ getValue, row }) {
      const id = getValue<string>()
      return h(UserLogo, {
        firstname: row.original.person.firstname,
        lastname: row.original.person.lastname,
        photoId: id,
        cssClasses: 'h-10 w-10',
      })
    },
  }),
  column.accessor('person', {
    id: 'name',
    header: 'Name',
    cell({ row }) {
      return `${row.original.person.firstname} ${row.original.person.lastname}`
    },
  }),
  column.accessor('email', {
    header: 'E-Mail Adresse',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  column.accessor('activatedAt', {
    header: 'Aktiviert am',
    enableSorting: true,
    cell: ({ getValue }) => formatTimestamp(getValue<Date>()),
  }),
  column.accessor('role', {
    header: 'Rolle',
    enableColumnFilter: true,
    cell({ getValue }) {
      const role = getValue<Role>()
      return h(Badge, {
        text: roleMapping[role].human,
        color: roleColors[role],
      })
    },
    meta: {
      filter: {
        type: 'select',
        options: Object.keys(roleMapping).map((r) => ({
          label: roleMapping[r].human,
          value: r,
        })),
      },
    },
  }),
  column.accessor('status', {
    header: 'Status',
    enableColumnFilter: true,
    cell({ getValue }) {
      const status = getValue<AccountStatus>()
      return h(Badge, {
        text: AccountStatusMapping[status].human,
        color: statusColors[status],
      })
    },
    meta: {
      filter: {
        type: 'select',
        options: Object.keys(AccountStatusMapping).map((r) => ({
          label: AccountStatusMapping[r].human,
          value: r,
        })),
      },
    },
  }),
]

const query: Query<Account> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['account', pagination, filter, orderBy],
    queryFn: () =>
      apiClient.account.verwaltungList.query({
        pagination: {
          pageIndex: pagination.value.pageIndex,
          pageSize: pagination.value.pageSize,
        },
        filter: filter.value.reduce((prev, curr) => {
          return {
            ...prev,
            [curr.id]: curr.value,
          }
        }, {}),
        orderBy: orderBy.value,
      }),
    initialData,
    placeholderData: keepPreviousData,
  })

const router = useRouter()

function onClick(account: Account) {
  router.push({ name: 'Verwaltung Accountdetails', params: { accountId: account.id } })
}
</script>

<template>
  <div class="my-4 flex justify-between">
    <div>
      <p class="max-w-2xl text-sm">Hier findest Du alle Personen die sich zu Veranstaltungen angemeldet haben.</p>
    </div>
    <RouterLink
      class="text-primary-500 flex items-center"
      :to="{ name: 'Verwaltung Account erstellen' }"
    >
      <PlusIcon class="h-5 w-5 mr-1" />
      Account anlegen
    </RouterLink>
  </div>

  <DataTable
    :query="query"
    :columns="columns"
    @dblclick="onClick"
  />
</template>
