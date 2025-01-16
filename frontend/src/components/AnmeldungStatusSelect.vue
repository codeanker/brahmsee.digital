<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import { apiClient } from '@/api'
import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import { type AnmeldungStatus, AnmeldungStatusMapping, getEnumOptions } from '@codeanker/api'

const props = withDefaults(
  defineProps<{
    status: AnmeldungStatus
    id: number
    meldeschluss: Date
  }>(),
  {}
)

const emit = defineEmits<{
  changed: () => void
}>()

const currentStatus = ref(props.status)
const statusOptions = getEnumOptions(AnmeldungStatusMapping)
const availableOptions = statusOptions.filter(
  (status) => status.value == 'ABGELEHNT' || status.value == 'STORNIERT' || status.value == 'BESTAETIGT'
)

const getStatusHuman = computed(() => (anmeldungStatus) => {
  return statusOptions.find((status) => status.value === anmeldungStatus)?.label
})

const isStatusChangeAvailable = computed(() => {
  if (loggedInAccount.value?.role === 'ADMIN' || props.meldeschluss > new Date()) {
    return true
  }
  return false
})

const setStatus = async (status: AnmeldungStatus) => {
  if (status == 'BESTAETIGT') {
    await apiClient.anmeldung.verwaltungAnnehmen.mutate({
      anmeldungId: props.id,
    })
    emit('changed')
  }
  if (status == 'STORNIERT') {
    await apiClient.anmeldung.verwaltungStorno.mutate({
      anmeldungId: props.id,
    })
    emit('changed')
  }
  if (status == 'ABGELEHNT') {
    await apiClient.anmeldung.verwaltungAblehnen.mutate({
      anmeldungId: props.id,
    })
    emit('changed')
  }
}
</script>

<template>
  <BasicDropdown
    :right="false"
    :append="true"
    class="w-full"
    :disabled="!isStatusChangeAvailable"
    button-style="w-full min-w-52 text-left"
  >
    <template #buttonContent>
      <button
        type="button"
        class="input-style w-full text-left !flex justify-between items-center"
        :class="[!isStatusChangeAvailable ? 'cursor-not-allowed' : 'hover:cursor-pointer']"
      >
        <slot>
          <div class="flex space-x-2 items-center">
            <div
              class="w-4 h-4 rounded-full shrink-0"
              :class="`bg-${getAnmeldungStatusColor(currentStatus)}-600`"
            />
            <span>{{ getStatusHuman(currentStatus) }}</span>
          </div>
          <ChevronDownIcon
            v-if="isStatusChangeAvailable"
            class="h-5 text-gray-500"
          />
        </slot>
      </button>
    </template>
    <template #dropdownContent>
      <MenuItem
        as="div"
        class=""
      >
        <button
          v-for="statusOption in availableOptions"
          :key="statusOption.value"
          type="button"
          class="hover:bg-primary-50 dark:hover:bg-slate-950 rounded items-center flex p-2 w-full space-x-2 text-left"
          @click="(currentStatus = statusOption.value) && setStatus(statusOption.value)"
        >
          <div
            class="w-4 h-4 rounded-full shrink-0"
            :class="`bg-${getAnmeldungStatusColor(statusOption.value)}-600`"
          />
          <div>
            <div class="">
              {{ statusOption.label }}
            </div>
            <div class="text-sm text-gray-500">
              {{ statusOption.description }}
            </div>
          </div>
        </button>
      </MenuItem>
    </template>
  </BasicDropdown>
</template>
