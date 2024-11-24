<script setup lang="ts">
import { CheckIcon, CubeTransparentIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import Loading from '../UIComponents/Loading.vue'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import { CustomFieldPositionMapping, CustomFieldTypeMapping, getEnumOptions, type RouterInput } from '@codeanker/api'

type Query = RouterInput['customFields']['list']

const props = defineProps<{
  entity: Query['entity']
  id: number
  // columns?: string[]
}>()

const { state: fields, isLoading } = useAsyncState(async () => {
  return apiClient.customFields.list.query({
    // filter: {
    //   veranstaltungId: props.veranstaltungId,
    // },
    // pagination: { take: 100, skip: 0 },
    entity: props.entity,
    entityId: props.id,
  })
}, [])

const router = useRouter()

type Field = (typeof fields.value)[number]

function canEdit(field: Field) {
  return loggedInAccount.value?.role === 'ADMIN' || field.unterveranstaltungId !== null
}

function onClickRow(field: Field) {
  if (!canEdit(field)) {
    return
  }

  if (props.entity === 'veranstaltung') {
    return router.push({
      name: 'Verwaltung Custom Field bearbeiten',
      params: { veranstaltungId: props.id, fieldId: field.id },
    })
  }

  if (props.entity === 'unterveranstaltung') {
    router.push({
      name: 'Unterveranstaltung Custom Field bearbeiten',
      params: { unterveranstaltungId: props.id, fieldId: field.id },
    })
  }
}

const getFieldTypeHuman = computed(() => (field: Field) => {
  return getEnumOptions(CustomFieldTypeMapping).find((m) => m.value === field.type)?.label
})

function formatPositions(field: Field) {
  return getEnumOptions(CustomFieldPositionMapping)
    .filter((o) => field.positions.includes(o.value))
    .map((o) => o.label)
    .join(', ')
}
</script>

<template>
  <div>
    <table
      v-if="fields"
      class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
    >
      <thead>
        <tr>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Name
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Typ
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Quelle
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Erforderlich?
          </th>
          <th
            scope="col"
            class="px-3 py-3.5 text-left text-sm font-semibold"
          >
            Positionen
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-dark-primary">
        <tr
          v-for="field in fields"
          :key="field.id"
          :class="{
            'even:bg-gray-50 dark:even:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800': true,
            'cursor-pointer': canEdit(field),
            'cursor-not-allowed': !canEdit(field),
          }"
          :title="canEdit(field) ? 'Bearbeiten' : 'Dieses Feld darfst du nicht bearbeiten'"
          @click="() => onClickRow(field)"
        >
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div>{{ field.name }}</div>
            <div
              v-if="field.description"
              class="text-xs text-gray-500"
            >
              {{ field.description }}
            </div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <div>{{ getFieldTypeHuman(field) }}</div>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <p v-if="field.veranstaltungId !== null">Veranstaltung</p>
            <p v-if="field.unterveranstaltungId !== null">Ausschreibung</p>
          </td>
          <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
            <CheckIcon
              v-if="field.required"
              class="text-primary-600 size-5"
            />
            <XMarkIcon
              v-else
              class="text-red-600 size-5"
            />
          </td>
          <td class="py-5 pl-4 pr-3 text-sm">
            <div>{{ formatPositions(field) }}</div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="isLoading">
      <Loading />
    </div>
    <div
      v-else-if="fields.length <= 0"
      class="rounded-md bg-blue-50 dark:bg-blue-950 p-4 text-blue-500"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <CubeTransparentIcon
            class="h-5 w-5"
            aria-hidden="true"
          />
        </div>
        <div class="ml-3 flex-1 md:flex md:justify-between">
          <p class="text-sm mb-0">Es wurden keine benutzerdefinierten Felder angelegt.</p>
        </div>
      </div>
    </div>
  </div>
</template>
