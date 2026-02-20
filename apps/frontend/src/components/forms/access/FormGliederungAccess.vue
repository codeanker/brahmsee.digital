<script setup lang="ts">
import { apiClient } from '@/api'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'
import cn from '@/helpers/cn'
import type { RouterOutput } from '@codeanker/api'
import { ValidateForm } from '@codeanker/validation'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { ref } from 'vue'

type AccountTypeaheadResult = RouterOutput['account']['verwaltungList']['data'][number]
type GliederungTypeaheadResult = RouterOutput['gliederung']['publicList'][number]

type Mode =
  | { mode: 'account', accountId: string }
  | { mode: 'gliederung', gliederungId: string }

const { mode } = defineProps<{
  mode?: Mode
}>()

const emit = defineEmits<{
  cancel: []
}>()

const input = ref<{
  account?: AccountTypeaheadResult
  gliederung?: GliederungTypeaheadResult
}>({})

async function queryObjectGliederungen(searchTerm) {
  return apiClient.gliederung.publicList.query({
    filter: { name: searchTerm },
    orderBy: [],
    pagination: { take: 100, skip: 0 },
  })
}
async function queryObjectAccount(searchTerm) {
  return apiClient.account.verwaltungList.query({
    filter: { email: searchTerm },
  })
}

const queryClient = useQueryClient()

const { mutate, error, isError, isPending } = useMutation({
  mutationKey: ['createGliederungAccess'],
  mutationFn: async () => {
    if (mode?.mode === 'account') {
      if (!input.value.gliederung) {
        throw new Error('form not valid')
      }

      await apiClient.access.createForGliederung.mutate({
        accountId: mode.accountId,
        gliederungId: input.value.gliederung?.id,
      })
    } else if (mode?.mode === 'gliederung') {
      if (!input.value.account) {
        throw new Error('form not valid')
      }

      await apiClient.access.createForGliederung.mutate({
        accountId: input.value.account?.id,
        gliederungId: mode.gliederungId,
      })
    } else {
      if (!input.value.account || !input.value.gliederung) {
        throw new Error('form not valid')
      }

      await apiClient.access.createForGliederung.mutate({
        accountId: input.value.account?.id,
        gliederungId: input.value.gliederung?.id,
      })
    }

    queryClient.invalidateQueries({
      queryKey: ['listAllGliederungAdminRequests'],
    })
  },
})
</script>

<template>
  <ValidateForm
    @submit="mutate"
  >
    <div
      :class="cn(
        'grid gap-4',
        {
          'grid-cols-1': mode !== undefined,
          'grid-cols-2': mode === undefined,
        }
      )"
    >
      <BasicTypeahead
        v-if="mode?.mode !== 'gliederung'"
        v-model="input.gliederung"
        :query="queryObjectGliederungen"
        :input-formatter="(result) => result?.name"
        :result-formatter="(result) => result.name"
        :strict="true"
        :disabled="isPending"
        label="Gliederung"
        required
        placeholder="Gliederung suchen"
      />
      <BasicTypeahead
        v-if="mode?.mode !== 'account'"
        v-model="input.account"
        :query="queryObjectAccount"
        :input-formatter="(result) => result?.email"
        :result-formatter="(result) => result.email"
        :strict="true"
        :disabled="isPending"
        label="Account (E-Mail Adresse)"
        required
        placeholder="Account suchen"
      />
    </div>

    <div class="mt-4 flex gap-4 items-center">
      <Button color="danger" @click="() => emit('cancel')"> Abbrechen </Button>
      <Button
        color="primary"
        type="submit"
      >
        <template v-if="isPending">
          <Loading color="white" />
        </template>
        <span>Speichern</span>
      </Button>
    </div>
  </ValidateForm>

  <template v-if="isError">
    <div class="flex flex-col text-center items-center justify-center text-danger-600">
      <XMarkIcon class="h-10 mb-2" />
      <span> {{ error }} </span>
    </div>
  </template>
</template>
