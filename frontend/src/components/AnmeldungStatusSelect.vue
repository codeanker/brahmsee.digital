<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import { AnmeldungStatus, AnmeldungStatusMapping, getEnumOptions, Role } from '@codeanker/api/src/enumMappings'
import { Dropdown } from '@codeanker/core-ui-components'

const props = withDefaults(
  defineProps<{
    status: AnmeldungStatus
    id: number
    meldeschluss: Date
  }>(),
  {}
)

const currentStatus = ref(props.status)
const statusOptions = getEnumOptions(AnmeldungStatusMapping)
const availableOptions = statusOptions.filter(
  (status) =>
    status.value == AnmeldungStatus.ABGELEHNT ||
    status.value == AnmeldungStatus.STORNIERT ||
    status.value == AnmeldungStatus.BESTAETIGT
)

const getStatusHuman = computed(() => (anmeldungStatus) => {
  return statusOptions.find((status) => status.value === anmeldungStatus)?.label
})

const isStatusChangeAvailable = computed(() => {
  if (loggedInAccount.value?.role === Role.ADMIN || props.meldeschluss > new Date()) {
    return true
  }
  return false
})

const setStatus = async (status) => {
  if (status == AnmeldungStatus.BESTAETIGT) {
    await apiClient.anmeldung.verwaltungAnnehmen.mutate({
      anmeldungId: props.id,
    })
  }
  if (status == AnmeldungStatus.STORNIERT) {
    await apiClient.anmeldung.verwaltungStorno.mutate({
      anmeldungId: props.id,
    })
  }
  if (status == AnmeldungStatus.ABGELEHNT) {
    await apiClient.anmeldung.verwaltungAblehnen.mutate({
      anmeldungId: props.id,
    })
  }
}
</script>

<template>
  <Dropdown
    :right="false"
    :append="true"
    class="w-full"
    :disabled="!isStatusChangeAvailable"
    :button-style="['w-full min-w-52 text-left']"
  >
    <template #buttonContent>
      <button
        type="button"
        class="input-style w-full block text-left flex justify-between items-center"
        :class="[!isStatusChangeAvailable ? 'cursor-not-allowed' : 'hover:cursor-pointer']"
      >
        <slot>
          <div class="flex space-x-2 items-center">
            <div
              class="w-4 h-4 rounded-full shrink-0"
              :class="`bg-${getAnmeldungStatusColor(currentStatus)}-600`"
            ></div>
            <span>{{ getStatusHuman(currentStatus) }}</span>
          </div>
        </slot>
        <ChevronDownIcon
          v-if="isStatusChangeAvailable"
          class="h-5 text-gray-500"
        />
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
          class="hover:bg-primary-light rounded items-center flex p-2 w-full space-x-2 text-left"
          @click="(currentStatus = statusOption.value) && setStatus(statusOption.value)"
        >
          <div
            class="w-4 h-4 rounded-full shrink-0"
            :class="`bg-${getAnmeldungStatusColor(statusOption.value)}-600`"
          ></div>
          <div>
            <div>{{ statusOption.label }}</div>
            <div class="text-xs text-gray-500">{{ statusOption.description }}</div>
          </div>
        </button>
      </MenuItem>
    </template>
  </Dropdown>
</template>
