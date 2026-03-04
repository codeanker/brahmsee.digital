<script setup lang="ts">
import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'
import { useRouteTitle } from '@/composables/useRouteTitle'
import cn from '@/helpers/cn'
import { CustomFieldTypeMapping, type CustomField } from '@codeanker/api'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/24/outline'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useRouteParams } from '@vueuse/router'
import { ref, watch } from 'vue'

const { setTitle } = useRouteTitle()
setTitle('Benutzerdefinierte Felder sortieren')

const veranstaltungId = useRouteParams<string>('veranstaltungId')

const { data, dataUpdatedAt, refetch } = useQuery({
  queryKey: ['customFields', 'veranstaltung', veranstaltungId.value],
  queryFn: () =>
    apiClient.customFields.list.query({
      entity: 'veranstaltung',
      entityId: veranstaltungId.value,
    }),
  enabled: () => !!veranstaltungId.value,
  initialData: [],
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

function moveUp(index: number) {
  const rows = [copy.value[index - 1], copy.value[index]]
  copy.value.splice(index - 1, 2, rows[1], rows[0])
}

function moveDown(index: number) {
  const rows = [copy.value[index], copy.value[index + 1]]
  copy.value.splice(index, 2, rows[1], rows[0])
}

const { mutate, isPending } = useMutation({
  mutationFn: async () => {
    const ids = copy.value.map(({ id }) => id)
    await apiClient.customFields.veranstaltungOrder.mutate({
      veranstaltungId: veranstaltungId.value,
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
      <tr
        v-for="(field, index) in copy"
        :key="field.id"
        class="even:bg-slate-50 dark:even:bg-slate-800"
      >
        <td class="px-2 py-4 flex flex-row justify-between">
          <div class="space-x-2">
            <span>{{ field.order || '-' }}</span>
            <span class="opacity-50"
              >( <i>{{ index + 1 }}</i> )</span
            >
          </div>
          <div class="space-x-2">
            <Button
              :disabled="index === 0"
              @click="moveUp(index)"
            >
              <ChevronUpIcon class="size-4" />
            </Button>
            <Button
              :disabled="index >= copy.length - 1"
              @click="moveDown(index)"
            >
              <ChevronDownIcon class="size-4" />
            </Button>
          </div>
        </td>
        <td class="px-2 py-4">{{ field.name }}</td>
        <td class="px-2 py-4">{{ formatType(field) }}</td>
        <td class="px-2 py-4">Veranstaltung</td>
      </tr>
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
      :to="{ name: 'Verwaltung Veranstaltungsdetails', params: { veranstaltungId } }"
      >Abbrechen</Button
    >
  </div>
</template>
