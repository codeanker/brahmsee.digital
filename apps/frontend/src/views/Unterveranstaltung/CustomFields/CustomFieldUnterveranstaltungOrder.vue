<script setup lang="ts">
import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import cn from '@/helpers/cn'
import { CustomFieldTypeMapping, type CustomField } from '@codeanker/api'
import { groupBy } from '@codeanker/helpers'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRouteParams } from '@vueuse/router'
import { computed, ref, watch } from 'vue'

const { setTitle } = useRouteTitle()
setTitle('Benutzerdefinierte Felder sortieren')

const unterveranstaltungId = useRouteParams<string>('unterveranstaltungId')

const { data, dataUpdatedAt, refetch } = useQuery({
  queryKey: ['customFields', 'unterveranstaltung', unterveranstaltungId],
  queryFn: () =>
    apiClient.customFields.list.query({
      entity: 'unterveranstaltung',
      entityId: unterveranstaltungId.value,
    }),
  enabled: () => !!unterveranstaltungId.value,
})

const copy = ref<CustomField[]>([])

watch(dataUpdatedAt, () => {
  if (data.value) {
    copy.value = [...data.value]
  }
})

function formatType(field: CustomField) {
  const { human } = CustomFieldTypeMapping[field.type]
  return human
}

function formatSource(field: CustomField) {
  if (field.veranstaltungId) {
    return 'Veranstaltung'
  } else if (field.unterveranstaltungId) {
    return 'Ausschreibung'
  }
  return '-'
}

type Grouped = {
  veranstaltung: CustomField[]
  ausschreibung: CustomField[]
}

const fields = computed<Grouped>(() => {
  return groupBy(copy.value, (field) => {
    if (field.veranstaltungId !== null) {
      return 'veranstaltung'
    }
    if (field.unterveranstaltungId !== null) {
      return 'ausschreibung'
    }
    return 'invalid'
  })
})

function moveUp(index: number) {
  const offset = fields.value.veranstaltung.length
  const realIndex = index + offset

  const rows = [copy.value[realIndex - 1], copy.value[realIndex]]
  copy.value.splice(realIndex - 1, 2, rows[1], rows[0])
}

function moveDown(index: number) {
  const offset = fields.value.veranstaltung.length
  const realIndex = index + offset

  const rows = [copy.value[realIndex], copy.value[realIndex + 1]]
  copy.value.splice(realIndex, 2, rows[1], rows[0])
}

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const ids = fields.value.ausschreibung.map(({ id }) => id)
    await apiClient.customFields.unterveranstaltungOrder.mutate({
      unterveranstaltungId: unterveranstaltungId.value,
      fields: ids,
    })
    await refetch()
  },
})
</script>

<template>
  <table class="w-full">
    <thead class="bg-primary-700 text-white">
      <tr>
        <th class="text-left px-2 py-4 border-b-2">Reihenfolge</th>
        <th class="text-left px-2 py-4 border-b-2">Name</th>
        <th class="text-left px-2 py-4 border-b-2">Typ</th>
        <th class="text-left px-2 py-4 border-b-2">Quelle</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(_, group) in fields">
        <tr
          v-for="(field, index) in fields[group]"
          :key="field.id"
          :class="
            cn({
              'even:bg-slate-50 dark:even:bg-slate-800': !!field.unterveranstaltungId,
              'text-gray-400 italic': !!field.veranstaltungId,
            })
          "
        >
          <td class="px-2 py-4 flex flex-row justify-between">
            <div class="space-x-2">
              <span>{{ field.order || '-' }}</span>
              <span class="opacity-50"
                >( <i>{{ index + 1 }}</i> )</span
              >
            </div>
            <div
              v-if="!!field.unterveranstaltungId"
              class="space-x-2"
            >
              <Button
                :disabled="index === 0"
                @click="moveUp(index)"
              >
                <ChevronUpIcon class="size-4" />
              </Button>
              <Button
                :disabled="index >= fields[group].length - 1"
                @click="moveDown(index)"
              >
                <ChevronDownIcon class="size-4" />
              </Button>
            </div>
          </td>
          <td class="px-2 py-4">{{ field.name }}</td>
          <td class="px-2 py-4">{{ formatType(field) }}</td>
          <td class="px-2 py-4">{{ formatSource(field) }}</td>
        </tr>
      </template>
    </tbody>
  </table>

  <p class="text-sm">
    <b>Hinweis</b>: Die Spalte <b>Reihenfolge</b> gliedert sich wie folgt: Die erste Zahl zeigt die aktuelle Position in
    der Reihenfolge wohingegen die Zahl in der Klammer die neue Position anzeigt.
  </p>

  <div class="mt-8 space-x-4">
    <Button
      :disabled="isPending"
      @click="mutate"
    >
      Speichern
    </Button>
    <Button
      color="danger"
      :to="{ name: 'UnterveranstaltungDetail', params: { unterveranstaltungId } }"
      >Abbrechen</Button
    >
  </div>
</template>
