<script setup lang="ts">
import { CodeBracketIcon, SquaresPlusIcon, TicketIcon, UserIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'

import { apiClient } from '@/api'
import AnmeldungStatusSelect from '@/components/AnmeldungStatusSelect.vue'
import CustomFieldsFormUser from '@/components/CustomFields/CustomFieldsFormUser.vue'
import FormPersonGeneral, { type FormPersonGeneralSubmit } from '@/components/forms/person/FormPersonGeneral.vue'
import Drawer from '@/components/LayoutComponents/Drawer.vue'
import Notification from '@/components/LayoutComponents/Notifications.vue'
import initialData from '@/components/Table/initialData'
import Tab from '@/components/UIComponents/components/Tab.vue'
import Tabs from '@/components/UIComponents/Tabs.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import {
  AnmeldungStatusMapping,
  type AnmeldungStatus,
  type NahrungsmittelIntoleranz,
  type RouterInput,
  type RouterOutput,
} from '@codeanker/api'
import { dayjs } from '@codeanker/helpers'
import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { createColumnHelper } from '@tanstack/vue-table'
import { h } from 'vue'
import BasicSwitch from '../BasicInputs/BasicSwitch.vue'
import DataTable, { type Query } from '../Table/DataTable.vue'
import UserLogo from '../UIComponents/UserLogo.vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/solid'

type Props = {
  filter: Exclude<RouterInput['anmeldung']['list']['filter'], undefined>['scope']
  showStats?: boolean
}

const props = defineProps<Props>()

const tabs = [
  { name: 'Anmeldung', icon: TicketIcon },
  { name: 'Person', icon: UserIcon },
  { name: 'Zusatzfelder', icon: SquaresPlusIcon },
]

if (loggedInAccount.value?.role === 'ADMIN') {
  tabs.push({ name: 'Entwickler:in', icon: CodeBracketIcon })
}

const showNotification = ref(false)

const { state: countAnmeldungen } = useAsyncState(
  () =>
    apiClient.anmeldung.count.query({
      filter: props.filter ?? { type: 'own' },
    }),
  { OFFEN: 0, BESTAETIGT: 0, STORNIERT: 0, ABGELEHNT: 0, total: 0 }
)

const stats = computed<
  {
    name: AnmeldungStatus
    value: number
  }[]
>(() => {
  if (!countAnmeldungen.value) return []
  return [
    { name: 'OFFEN', value: countAnmeldungen.value.OFFEN },
    { name: 'BESTAETIGT', value: countAnmeldungen.value.BESTAETIGT },
    { name: 'STORNIERT', value: countAnmeldungen.value.STORNIERT },
    { name: 'ABGELEHNT', value: countAnmeldungen.value.ABGELEHNT },
  ]
})

const selectedAnmeldungId = ref()
const showDrawer = ref(false)

async function toggleDrawer(anmeldung: Anmeldung) {
  selectedAnmeldungId.value = anmeldung.id
  showDrawer.value = true
  await getSingleAnmeldung()
  await loadCustomFields()
}

const { state: customFields, execute: loadCustomFields } = useAsyncState(
  async () => {
    if (!currentAnmeldung.value) {
      return []
    }

    return await apiClient.customFields.list.query({
      entity: 'unterveranstaltung',
      entityId: currentAnmeldung.value.unterveranstaltung.id,
    })
  },
  [],
  {
    immediate: false,
  }
)

const {
  state: currentAnmeldung,
  execute: getSingleAnmeldung,
  isLoading: isLoading,
} = useAsyncState(
  async () => {
    const result = await apiClient.anmeldung.get.query({
      anmeldungId: selectedAnmeldungId.value,
    })

    return result[0]
  },
  null,
  { immediate: false }
)

const dataTable = useTemplateRef('data-table')

const { execute: updateAnmeldung } = useAsyncState(
  async (anmeldung: FormPersonGeneralSubmit) => {
    const nahrungsmittelIntoleranzen = Object.entries(anmeldung.essgewohnheiten.intoleranzen)
      .filter((entry) => {
        return entry[1]
      })
      .map((entry) => entry[0] as NahrungsmittelIntoleranz)
    const personId = currentAnmeldung.value?.person.id
    if (personId) {
      const data = {
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
        },
      }
      await apiClient.person.patch.mutate(data)
      if (loggedInAccount.value?.role === 'ADMIN') {
        await apiClient.anmeldung.verwaltungPatch.mutate({
          id: selectedAnmeldungId.value,
          data: {
            comment: anmeldung.comment,
          },
        })
      } else {
        await apiClient.anmeldung.gliederungPatch.mutate({
          id: selectedAnmeldungId.value,
          data: {
            comment: anmeldung.comment,
          },
        })
      }
      showNotification.value = true

      await getSingleAnmeldung()
      await dataTable.value?.query.refetch()
    }
  },
  null,
  {
    immediate: false,
  }
)
type Anmeldung = RouterOutput['anmeldung']['list']['data'][number]

const column = createColumnHelper<Anmeldung>()
const columns = [
  column.accessor('person.photoId', {
    size: 10,
    header: 'Foto',
    cell({ row }) {
      return h(UserLogo, {
        firstname: row.original.person.firstname,
        lastname: row.original.person.lastname,
        photoId: row.original.person.photoId,
        personId: row.original.person.id,
        cssClasses: 'h-10 w-10',
      })
    },
  }),
  column.accessor('person', {
    header: 'Person',
    enableColumnFilter: true,
    cell({ row }) {
      return `${row.original.person.firstname} ${row.original.person.lastname}`
    },
  }),
  column.accessor('person.birthday', {
    header: 'Alter',
    cell({ getValue }) {
      const value = getValue<Date>()
      return dayjs().diff(value, 'year') + ' Jahre'
    },
  }),
  column.accessor('createdAt', {
    header: 'Anmeldedatum',
    cell({ getValue }) {
      const value = getValue<Date>()
      return dayjs(value).format('dddd, DD. MMM YYYY, HH:mm')
    },
  }),
  column.accessor('person.gliederung.name', {
    id: 'gliederung',
    header: 'Gliederung',
    enableColumnFilter: true,
    meta: {
      hidden: computed(() => loggedInAccount.value?.role === 'ADMIN'),
    },
  }),
  column.accessor('status', {
    header: 'Status',
    size: 150,
    enableColumnFilter: true,
    meta: {
      filter: {
        type: 'select',
        options: [
          { label: 'Abgelehnt', value: 'ABGELEHNT' },
          { label: 'Bestätigt', value: 'BESTAETIGT' },
          { label: 'Offen', value: 'OFFEN' },
          { label: 'Storniert', value: 'STORNIERT' },
        ] satisfies { label: string; value: AnmeldungStatus }[],
      },
    },
    cell({ row }) {
      return h(AnmeldungStatusSelect, {
        id: row.original.id,
        status: row.original.status,
        meldeschluss: row.original.unterveranstaltung.veranstaltung.meldeschluss,
      })
    },
  }),
]

const ohneFoto = ref(false)

const query: Query<Anmeldung> = (pagination, filter) =>
  useQuery({
    queryKey: ['anmeldung', pagination, filter, ohneFoto],
    queryFn: () =>
      apiClient.anmeldung.list.query({
        pagination: {
          pageIndex: pagination.value.pageIndex,
          pageSize: pagination.value.pageSize,
        },
        filter: {
          scope: props.filter,
          withoutPhoto: ohneFoto.value,
          ...filter.value.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.id]: curr.value,
            }
          }, {}),
        },
      }),
    initialData,
    placeholderData: keepPreviousData,
  })
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
        />
        <div>
          <div class="text-sm font-medium">
            {{ AnmeldungStatusMapping[stat.name].human }}
          </div>
          <p class="flex items-baseline gap-x-2">
            <span class="text-2xl font-semibold tracking-tight">{{ stat.value }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="grid-rows[1fr, 50px] grid flex-grow">
    <DataTable
      ref="data-table"
      :query="query"
      :columns="columns"
      @dblclick="toggleDrawer"
    >
      <template #filter>
        <BasicSwitch
          v-model="ohneFoto"
          label="Ohne Foto"
          class="grid-rows-2"
        />
      </template>
    </DataTable>
  </div>
  <Drawer
    v-if="showDrawer"
    @close="showDrawer = false"
  >
    <template #title>
      <div class="mb-4 md:w-[700px] xl:w-[900px]">
        <div class="mx-auto lg:mx-0 flex items-center space-x-4">
          <div class="w-20 h-20 shrink-0">
            <UserLogo
              v-if="currentAnmeldung?.person?.firstname && currentAnmeldung?.person?.lastname"
              :firstname="currentAnmeldung?.person?.firstname"
              :lastname="currentAnmeldung?.person?.lastname"
              :edit="true"
              :person-id="currentAnmeldung?.person.id"
              :photo-id="currentAnmeldung?.person.photoId"
              size="xl"
            />
          </div>
          <div class="flex items-center">
            <h2 class="my-2 text-xl font-bold tracking-tight sm:text-2xl">
              {{ currentAnmeldung?.person?.firstname }} {{ currentAnmeldung?.person?.lastname }}
            </h2>
            <div
              class="w-4 h-4 rounded-full shrink-0 ml-2"
              :class="`bg-${getAnmeldungStatusColor(currentAnmeldung?.status)}-600`"
            />
          </div>
        </div>
      </div>
    </template>
    <template #content>
      <div class="p-4">
        <Tabs
          content-space="4"
          :default-index="0"
          :tabs="tabs"
          :persistent="false"
        >
          <Tab>
            <div class="px-4 py-5 sm:px-0 sm:py-0">
              <dl class="space-y-8 sm:space-y-0 sm:divide-y sm:divide-gray-200">
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0 lg:w-48">Veranstaltung</dt>
                  <dd class="mt-1 text-gray-900 dark:text-gray-100 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    {{ currentAnmeldung?.unterveranstaltung.veranstaltung.name }}
                  </dd>
                </div>
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0 lg:w-48">Unterveranstaltung</dt>
                  <dd class="mt-1 text-gray-900 dark:text-gray-100 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    <div class="flex space-x-1 items-center">
                      <span>{{ currentAnmeldung?.unterveranstaltung.beschreibung }}</span>
                      <RouterLink
                        target="_blank"
                        class="text-primary-600 hover:text-primary-700"
                        :to="{
                          name: 'UnterveranstaltungDetail',
                          params: { unterveranstaltungId: currentAnmeldung?.unterveranstaltung.id },
                        }"
                      >
                        <ArrowTopRightOnSquareIcon class="h-4 w-4" />
                      </RouterLink>
                      <span class="text-gray-500">({{ currentAnmeldung?.unterveranstaltung.gliederung.name }})</span>
                    </div>
                  </dd>
                </div>
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0 lg:w-48">Status</dt>
                  <dd class="mt-1 text-gray-900 dark:text-gray-100 sm:col-span-2 sm:ml-6 sm:mt-0">
                    <AnmeldungStatusSelect
                      v-if="currentAnmeldung?.unterveranstaltung.veranstaltung.meldeschluss"
                      :id="currentAnmeldung.id"
                      class="w-[300px]"
                      :status="currentAnmeldung.status"
                      :meldeschluss="currentAnmeldung.unterveranstaltung.veranstaltung.meldeschluss"
                      @changed="getSingleAnmeldung"
                    />
                  </dd>
                </div>

                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0 lg:w-48">Bemerkung</dt>
                  <dd
                    class="mt-1 text-gray-900 dark:text-gray-100 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line max-w-96"
                  >
                    <template v-if="currentAnmeldung?.comment">
                      {{ currentAnmeldung?.comment }}
                    </template>
                    <template v-if="!currentAnmeldung?.comment"> - </template>
                  </dd>
                </div>
                <div class="sm:flex sm:px-6 sm:py-5">
                  <dt class="text-gray-500 dark:text-gray-300 sm:w-40 sm:flex-shrink-0 lg:w-48">Angemeldet am</dt>
                  <dd class="mt-1 text-gray-900 dark:text-gray-100 sm:col-span-2 sm:ml-6 sm:mt-0 whitespace-pre-line">
                    {{ dayjs(currentAnmeldung?.createdAt).format('DD.MM.YYYY HH:mm') }}
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
              @submit="(data) => updateAnmeldung(undefined, data)"
            />
          </Tab>
          <Tab>
            <CustomFieldsFormUser
              v-if="currentAnmeldung?.customFieldValues"
              class="mt-8"
              :entry-id="currentAnmeldung.id"
              :custom-fields="customFields"
              :custom-field-values="currentAnmeldung?.customFieldValues"
              @update:success="showNotification = true"
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
  <Notification
    v-if="showNotification"
    :duration="2000"
    @close="showNotification = false"
  >
    <template #title> Erfolgreich gespeichert </template>
    <template #content>
      <p class="mt-1 text-sm text-gray-500">Deine Änderungen wurden erfolgreich gespeichert.</p>
    </template>
  </Notification>
</template>

<style lang="scss" scoped>
.relative.h-full.w-full {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
