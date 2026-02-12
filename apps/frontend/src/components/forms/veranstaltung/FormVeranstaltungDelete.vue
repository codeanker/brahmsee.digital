<script setup lang="ts">
import { apiClient } from '@/api'
import Button from '@/components/UIComponents/Button.vue'
import { TrashIcon } from '@heroicons/vue/24/outline'
import { useMutation } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const { id } = defineProps<{
  id: string
}>()

const input = ref('')
const isValid = computed(() => input.value === 'Veranstaltung löschen')

const router = useRouter()

const { mutate, error, isError } = useMutation({
  mutationKey: ['veranstaltung', 'delete', id],
  mutationFn: async () => {
    await apiClient.veranstaltung.delete.mutate({ veranstaltungId: id })
    router.replace({ name: 'Verwaltung Veranstaltungen' })
  },
})
</script>

<template>
  <div class="p-6 border border-danger-600 rounded-md my-8 flex items-top space-x-4">
    <TrashIcon class="size-8 shrink-0 text-danger-600 mt-1" />
    <div class="space-y-3">
      <div class="font-bold text-lg text-danger-600">Veranstaltung löschen</div>
      <div>
        Das Löschen einer Veranstaltung hat weitreichende Konsequenzen! Alle damit verbundenen Daten wie Ausschreibungen
        und Teilnehmerdaten werden dauerhaft entfernt.
      </div>
      <div><b>Dieser Vorgang ist endgültig. Alle Informationen werden gelöscht.</b></div>
      <div>Gib den Text <span class="font-bold">Veranstaltung löschen</span> ein, um die Veranstaltung zu löschen.</div>
      <div class="flex">
        <input
          v-model="input"
          type="text"
          class="form-control rounded-r-none focus:border-danger-600"
          placeholder="Veranstaltung löschen"
        />
        <Button
          class="p-2 rounded-l-none"
          color="danger"
          :disabled="!isValid"
          @click="mutate"
        >
          Löschen
        </Button>
      </div>

      <div
        v-if="isError"
        class="bg-danger-100 text-danger-600 rounded p-2 text-center w-fit px-16"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>
