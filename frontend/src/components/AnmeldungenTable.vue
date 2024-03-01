<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import BasicGrid from './BasicGrid.vue'

import { apiClient } from '@/api'
import AnmeldungStatusSelect from '@/components/AnmeldungStatusSelect.vue'
import Drawer from '@/components/LayoutComponents/Drawer.vue'
import Button from '@/components/UIComponents/Button.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import { AnmeldungStatusMapping, type AnmeldungStatus, type RouterOutput, type RouterInput } from '@codeanker/api'
import { useGridPaginated, type TGridColumn } from '@codeanker/core-grid'
import { dayjs } from '@codeanker/helpers'

const props = withDefaults(
  defineProps<{
    unterveranstaltungId?: number
    veranstaltungId?: number
    showStats?: boolean
  }>(),
  {}
)

const { state: anmeldungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    if (props.unterveranstaltungId) {
      return apiClient.anmeldung.verwaltungList.query({
        filter: {
          unterveranstaltungId: props.unterveranstaltungId,
          veranstaltungId: undefined,
        },
        pagination: { take: 100, skip: 0 },
      })
    } else if (props.veranstaltungId) {
      return apiClient.anmeldung.verwaltungList.query({
        filter: {
          unterveranstaltungId: undefined,
          veranstaltungId: props.veranstaltungId,
        },
        pagination: { take: 100, skip: 0 },
      })
    }
  } else {
    return apiClient.anmeldung.gliederungList.query({
      filter: {
        unterveranstaltungId: props.unterveranstaltungId,
        veranstaltungId: props.veranstaltungId,
      },
      pagination: { take: 100, skip: 0 },
    })
  }
}, [])

const { state: countAnmeldungen } = useAsyncState(async () => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    if (!props.unterveranstaltungId && !props.veranstaltungId)
      return Promise.resolve({ OFFEN: 0, BESTAETIGT: 0, STORNIERT: 0, ABGELEHNT: 0 })
    if (props.unterveranstaltungId && props.veranstaltungId)
      throw new Error('You need to provide either unterveranstaltungId or veranstaltungId')

    if (props.unterveranstaltungId)
      return apiClient.anmeldung.verwaltungCount.query({
        filter: {
          unterveranstaltungId: props.unterveranstaltungId,
        },
      })
    else if (props.veranstaltungId)
      return apiClient.anmeldung.verwaltungCount.query({
        filter: {
          veranstaltungId: props.veranstaltungId,
        },
      })
  } else {
    return apiClient.anmeldung.gliederungCount.query({
      filter: {
        unterveranstaltungId: props.unterveranstaltungId,
        veranstaltungId: props.veranstaltungId,
      },
    })
  }
}, [])

// const selectedAnmeldung = ref(null)
const showDrawer = ref(false)

// @ToDo count for Gliederungen

const stats = computed<
  {
    name: AnmeldungStatus
    value: number
  }[]
>(() => {
  return [
    { name: 'OFFEN', value: countAnmeldungen.value.OFFEN },
    { name: 'BESTAETIGT', value: countAnmeldungen.value.BESTAETIGT },
    { name: 'STORNIERT', value: countAnmeldungen.value.STORNIERT },
    { name: 'ABGELEHNT', value: countAnmeldungen.value.ABGELEHNT },
  ]
})

// function toggleDrawer(anmeldung) {
//   selectedAnmeldung.value = anmeldung
//   showDrawer.value = true
// }

type Anmeldung = Awaited<RouterOutput['anmeldung']['verwaltungList']>[number]

const columns: TGridColumn<Anmeldung>[] = [
  {
    field: 'person',
    title: 'Name',
  },
  {
    field: 'person.birthday',
    format: (value) => dayjs().diff(value, 'year') + ' Jahre',
    title: 'Alter',
  },
  {
    field: 'tshirtBestellt',
    format: (value, row) => (value ? row.person.konfektionsgroesse : '-'),
    title: 'T-Shirt',
  },
  {
    field: 'status',
    title: 'Status',
    size: '300px',
  },
]
type Query = {
  filter: RouterInput['anmeldung']['verwaltungList']['filter']
  orderBy: RouterInput['anmeldung']['verwaltungList']['orderBy']
}
const query = ref<Query>({
  filter: {
    veranstaltungId: props.veranstaltungId as number,
    unterveranstaltungId: undefined,
  },
  orderBy: [],
})

const { grid, pageChange, fetchVisiblePages, page } = useGridPaginated({
  query,
  fetchCount: async (q) => {
    const { total } = await apiClient.anmeldung.verwaltungCount.query(q)
    return total
  },
  fetchPage: async (q) => {
    return await apiClient.anmeldung.verwaltungList.query({
      pagination: q.pagination,
      filter: q.filter,
      orderBy: [],
    })
  },
})

fetchVisiblePages()
</script>

<template>
  <!-- Stats-->
  <div
    v-if="showStats"
    class="grid grid-cols-2 gap-px lg:grid-cols-4 mb-6"
  >
    <div
      v-for="stat in stats"
      :key="stat.name"
      class=""
    >
      <div class="flex items-start space-x-2 text-sm">
        <div
          class="w-4 h-4 mt-1 rounded-full shrink-0"
          :class="`bg-${getAnmeldungStatusColor(stat.name)}-600`"
        ></div>
        <div>
          <div class="text-sm font-medium">{{ AnmeldungStatusMapping[stat.name].human }}</div>
          <p class="flex items-baseline gap-x-2">
            <span class="text-2xl font-semibold tracking-tight">{{ stat.value }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="relative w-full">
    <BasicGrid
      v-model:order-by="query.orderBy"
      v-model:filter="query.filter"
      :grid="grid"
      :columns="columns"
    >
      <template #person="{ fieldValue: person }">
        <td
          class="whitespace-nowrap py-5 pl-4 pr-3 text-sm group-[.uneven]:bg-gray-50 dark:group-[.uneven]:bg-gray-900 group-hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-t-gray-200"
        >
          <div class="flex space-x-1 items-center">
            <span>{{ person.firstname }} {{ person.lastname }}</span>
          </div>
          <span
            v-if="loggedInAccount?.role === 'ADMIN'"
            class="text-xs"
            >{{ person.gliederung?.name }}</span
          >
        </td>
      </template>

      <template #status="{ row: anmeldung }">
        <td
          class="px-3 py-5 text-sm group-[.uneven]:bg-gray-50 dark:group-[.uneven]:bg-gray-900 group-hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-t-gray-200"
        >
          <div class="flex items-center">
            <AnmeldungStatusSelect
              v-if="anmeldung.unterveranstaltung.veranstaltung.meldeschluss"
              :id="anmeldung.id"
              :status="anmeldung.status"
              :meldeschluss="anmeldung.unterveranstaltung.veranstaltung.meldeschluss"
            />
          </div>
        </td>
      </template>
    </BasicGrid>
    <Button
      color="primary"
      type="submit"
      :disabled="page === 0"
      @click="pageChange(page - 1)"
    >
      <span>Zurück</span>
    </Button>
    <Button
      color="primary"
      type="submit"
      @click="pageChange(page + 1)"
    >
      <span>Vor</span>
    </Button>
  </div>

  <!-- Stats-->

  <div
    v-if="!anmeldungen || anmeldungen.length <= 0"
    class="rounded-md bg-blue-50 dark:bg-blue-950 text-blue-500 p-4"
  >
    <div class="flex">
      <div class="flex-shrink-0">
        <CheckCircleIcon
          class="h-5 w-5"
          aria-hidden="true"
        />
      </div>
      <div class="ml-3 flex-1 md:flex md:justify-between">
        <p class="text-sm mb-0">Es gibt bisher keine Anmeldungen.</p>
      </div>
    </div>
  </div>
  <Drawer
    v-if="showDrawer"
    @close="showDrawer = false"
  >
    <div class="rounded-md bg-blue-50 dark:bg-blue-950 text-blue-500 p-4 mx-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <CheckCircleIcon
            class="h-5 w-5"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm mb-0">Hier sollen in Zukunft die Detail Informationen zu einer Anmeldung sichtbar sein.</p>
        </div>
      </div>
    </div>
  </Drawer>
</template>
