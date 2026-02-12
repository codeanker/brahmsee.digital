<script setup lang="ts">
import { apiClient } from '@/api'
import type { Query } from '@/components/Table/DataTable.vue'
import DataTable from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'

type AccessRequest = RouterOutput['access']['listAllGliederungAdminRequests']['data'][number]

const queryClient = useQueryClient()

const decide = useMutation({
  mutationKey: ['requestGliederungAdminDecide'],
  mutationFn: (input: RouterInput['access']['requestGliederungAdminDecide']) =>
    apiClient.access.requestGliederungAdminDecide.mutate(input),
  onSettled: () => {
    queryClient.refetchQueries({
      queryKey: ['listAllGliederungAdminRequests'],
    })
  },
})

const column = createColumnHelper<AccessRequest>()
const columns = [
  column.accessor('gliederung.name', {
    id: 'gliederung',
    header: 'Gliederung',
    enableColumnFilter: true,
    enableSorting: true,
  }),
  column.accessor('account.person', {
    id: 'person',
    header: 'Antragsteller',
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => {
      const { firstname, lastname } = getValue()
      return `${firstname} ${lastname}`
    },
  }),
  column.display({
    id: 'actions',
    header: 'Entscheidung',
    cell: ({ row }) => {
      return h(
        'div',
        {
          class: 'flex flex-row gap-x-2',
        },
        [
          h(
            Button,
            {
              color: 'primary',
              onClick: () => decide.mutate({ requestId: row.original.id, decision: true }),
            },
            'Bestätigen'
          ),
          h(
            Button,
            {
              color: 'danger',
              onClick: () => decide.mutate({ requestId: row.original.id, decision: false }),
            },
            'Ablehnen'
          ),
        ]
      )
    },
  }),
]

const query: Query<AccessRequest> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['listAllGliederungAdminRequests', pagination, filter, orderBy],
    queryFn: () =>
      apiClient.access.listAllGliederungAdminRequests.query({
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
</script>

<template>
  <div class="my-4 flex items-center justify-between">
    <div>
      <p class="text-xl font-bold">Anfragen</p>
      <p class="text-sm">Hier findest du alle Zugriffsanfragen auf Gliederungen.</p>
    </div>
  </div>

  <DataTable
    :query="query"
    :columns="columns"
  />
</template>
