<script setup lang="ts">
import { apiClient } from '@/api'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import type { Query } from '@/components/Table/DataTable.vue'
import DataTable from '@/components/Table/DataTable.vue'
import initialData from '@/components/Table/initialData'
import Button from '@/components/UIComponents/Button.vue'
import type { RouterInput, RouterOutput } from '@codeanker/api'
import { dayjs } from '@codeanker/helpers'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h, ref } from 'vue'
import { RouterLink } from 'vue-router'

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
  column.accessor('account', {
    id: 'account',
    header: 'Antragsteller',
    enableColumnFilter: true,
    enableSorting: true,
    cell: ({ getValue }) => {
      const { id, person } = getValue()
      return h(
        RouterLink,
        {
          to: {
            name: 'Verwaltung Accountdetails',
            params: { accountId: id },
          },
          class: 'flex flex-row gap-x-1 items-center h-full',
        },
        [
          h('span', `${person.firstname} ${person.lastname}`),
          h(ArrowTopRightOnSquareIcon, { class: 'h-4 w-4 text-primary-600' }),
        ]
      )
    },
  }),
  column.accessor('createdAt', {
    header: 'Erstellt am',
    cell: ({ getValue }) => {
      const date = getValue()
      return dayjs(date).format('DD.MM.YYYY [um] hh:mm [Uhr]')
    },
  }),
  column.accessor('confirmedAt', {
    header: 'Bestätigt am',
    cell: ({ getValue }) => {
      const date = getValue()
      if (date === null) {
        return ''
      }

      return dayjs(date).format('DD.MM.YYYY [um] hh:mm [Uhr]')
    },
  }),
  column.display({
    id: 'actions',
    header: 'Entscheidung',
    cell: ({ row }) => {
      if (row.original.confirmedByGliederung) {
        return h(
          'div',
          {
            class: 'flex flex-row gap-x-4 items-center',
          },
          [
            h(
              'span',
              {
                class: 'text-primary-600 font-medium',
              },
              'Bestätigt'
            ),
            h(
              Button,
              {
                color: 'danger',
                onClick: () => decide.mutate({ requestId: row.original.id, decision: false }),
              },
              'Widerrufen'
            ),
          ]
        )
      }

      return h(
        'div',
        {
          class: 'flex flex-row gap-x-2 items-center',
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

const nochOffen = ref(false)

const query: Query<AccessRequest> = (pagination, filter, orderBy) =>
  useQuery({
    queryKey: ['listAllGliederungAdminRequests', pagination, filter, orderBy, nochOffen],
    queryFn: () =>
      apiClient.access.listAllGliederungAdminRequests.query({
        pagination: {
          pageIndex: pagination.value.pageIndex,
          pageSize: pagination.value.pageSize,
        },
        filter: {
          confirmed: nochOffen.value ? false : undefined,
          ...filter.value.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.id]: curr.value,
            }
          }, {}),
        },
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
  >
    <template #filter>
      <BasicSwitch
        v-model="nochOffen"
        label="Nicht bestätigt"
        class="grid-rows-2"
      />
    </template>
  </DataTable>
</template>
