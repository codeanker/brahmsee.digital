<script setup lang="ts">
import { CheckCircleIcon, CodeBracketIcon, TicketIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref } from 'vue'

import BasicGrid from './BasicGrid.vue'

import { apiClient } from '@/api'
import AnmeldungStatusSelect from '@/components/AnmeldungStatusSelect.vue'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Drawer from '@/components/LayoutComponents/Drawer.vue'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import {
  AnmeldungStatusMapping,
  getEnumOptions,
  KonfektionsgroesseMapping,
  type AnmeldungStatus,
  type NahrungsmittelIntoleranz,
  type RouterInput,
  type RouterOutput,
} from '@codeanker/api'
import { useGrid, type TGridColumn } from '@codeanker/core-grid'
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

const selectedAnmeldungId = ref()
const showDrawer = ref(false)

function toggleDrawer($event) {
  selectedAnmeldungId.value = $event.id
  showDrawer.value = true
  getSingleAnmeldung()
}

const {
  state: currentAnmeldung,
  execute: getSingleAnmeldung,
  isLoading: isLoading,
} = useAsyncState(
  async () => {
    if (loggedInAccount.value?.role === 'ADMIN')
      return (
        await apiClient.anmeldung.verwaltungGet.query({
          anmeldungId: selectedAnmeldungId.value,
        })
      )[0]
    else
      return (
        await apiClient.anmeldung.gliederungGet.query({
          anmeldungId: selectedAnmeldungId.value,
        })
      )[0]
  },
  null,
  { immediate: false }
)

const { execute: update } = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranz)
    let personId = currentAnmeldung.value?.person.id
    if (personId) {
      let data = {
        id: personId,
        data: {
          gliederungId: anmeldung.gliederung.id,
          firstname: anmeldung.stammdaten.firstname,
          lastname: anmeldung.stammdaten.lastname,
          gender: anmeldung.stammdaten.gender,
          birthday: anmeldung.stammdaten.birthday ?? new Date(),
          email: anmeldung.contact.email,
          telefon: anmeldung.contact.telefon,

          address: {
            ...anmeldung.address,
          },

          notfallkontaktPersonen: anmeldung.notfallKontakte.personen,
          essgewohnheit: anmeldung.essgewohnheiten.essgewohnheit,
          nahrungsmittelIntoleranzen,
          weitereIntoleranzen: anmeldung.essgewohnheiten.weitereIntoleranzen,
          konfektionsgroesse: anmeldung.tshirt.groesse,
        },
      }
      if (loggedInAccount.value?.role === 'ADMIN') {
        await apiClient.person.verwaltungPatch.mutate(data)
        await apiClient.anmeldung.verwaltungPatch.mutate({
          id: selectedAnmeldungId.value,
          data: {
            comment: anmeldung.comment,
          },
        })
      } else {
        await apiClient.person.gliederungPatch.mutate(data)
        await apiClient.anmeldung.gliederungPatch.mutate({
          id: selectedAnmeldungId.value,
          data: {
            comment: anmeldung.comment,
          },
        })
      }

      await getSingleAnmeldung()
    }
  },
  null,
  {
    immediate: false,
  }
)

const konfektionsgroesseOptions = getEnumOptions(KonfektionsgroesseMapping)

const getKonfektionsgroesseHuman = computed(() => (konfektionsgroesse) => {
  return konfektionsgroesseOptions.find((item) => item.value === konfektionsgroesse)?.label
})

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
    format: (value, row) => (value ? getKonfektionsgroesseHuman.value(row.person.konfektionsgroesse) : '-'),
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
    unterveranstaltungId: props.unterveranstaltungId as number,
  },
  orderBy: [],
})

const { grid, indexChange, fetchVisiblePages } = useGrid({
  query,
  fetchCount: async (q) => {
    if (loggedInAccount.value?.role === 'ADMIN') return (await apiClient.anmeldung.verwaltungCount.query(q)).total
    else return (await apiClient.anmeldung.gliederungCount.query(q)).total
  },
  fetchPage: async (q) => {
    if (loggedInAccount.value?.role === 'ADMIN') return await apiClient.anmeldung.verwaltungList.query(q)
    else return await apiClient.anmeldung.gliederungList.query(q)
  },
})

fetchVisiblePages()

const tabs = [
  { name: 'Anmeldung', icon: TicketIcon },
  { name: 'Person', icon: UserIcon },
  // { name: 'Zusatzfelder', icon: SquaresPlusIcon },
]

if (loggedInAccount.value?.role === 'ADMIN') {
  tabs.push({ name: 'Entwickler:in', icon: CodeBracketIcon })
}
</script>

<template>
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
      @index-change="indexChange"
      @row-click="toggleDrawer($event)"
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
  </div>
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
    <template #title>
      <div class="mb-4 md:w-[700px] xl:w-[900px]">
        <div class="flex items-center">
          <h2 class="my-2 text-xl font-bold tracking-tight sm:text-2xl">
            {{ currentAnmeldung?.person?.firstname }} {{ currentAnmeldung?.person?.lastname }}
          </h2>
          <div
            class="w-4 h-4 rounded-full shrink-0 ml-2"
            :class="`bg-${getAnmeldungStatusColor(currentAnmeldung?.status)}-600`"
          ></div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="p-4">
        <Tabs
          content-space="4"
          :tabs="tabs"
        >
          <Tab>
            <div class="px-4 py-5 sm:px-0 sm:py-0">
              <dl class="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Veranstaltung</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    {{ currentAnmeldung?.unterveranstaltung.veranstaltung.name }}
                  </dd>
                </div>
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Status</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0">
                    <AnmeldungStatusSelect
                      v-if="currentAnmeldung?.unterveranstaltung.veranstaltung.meldeschluss"
                      :id="currentAnmeldung.id"
                      :status="currentAnmeldung.status"
                      :meldeschluss="currentAnmeldung.unterveranstaltung.veranstaltung.meldeschluss"
                      @changed="getSingleAnmeldung"
                    />
                  </dd>
                </div>
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">T-Shirt</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    <template v-if="currentAnmeldung?.tshirtBestellt">
                      {{ getKonfektionsgroesseHuman(currentAnmeldung.person.konfektionsgroesse) }}
                    </template>
                    <template v-if="!currentAnmeldung?.tshirtBestellt"> - </template>
                  </dd>
                </div>

                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Bemerkung</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    {{ currentAnmeldung?.comment }}
                  </dd>
                </div>
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0 lg:w-48">Angemeldet am</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    {{ dayjs(currentAnmeldung?.createdAt).format('DD.MM.YYYY hh:mm') }}
                  </dd>
                </div>
              </dl>
            </div>
          </Tab>
          <Tab>
            <FormPersonGeneral
              v-if="currentAnmeldung?.person"
              class="mt-8"
              :is-loading="isLoading"
              :person="currentAnmeldung.person"
              :error="undefined"
              @submit="(data) => update(undefined, data)"
            />
          </Tab>
          <Tab v-if="loggedInAccount?.role === 'ADMIN'">
            <div class="my-10">
              <div class="text-lg font-semibold">Entwickler:innen</div>
              <p class="max-w-2xl text-sm">Informationen für Entwickler:innen</p>
            </div>
            <pre>{{ currentAnmeldung }}</pre>
          </Tab>
        </Tabs>
      </div>
    </template>
  </Drawer>
</template>

<style lang="scss" scoped>
.relative.h-full.w-full {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
