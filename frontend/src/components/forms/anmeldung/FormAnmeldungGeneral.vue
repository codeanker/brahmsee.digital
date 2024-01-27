<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { ChevronDownIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { computed } from 'vue'

import { apiClient } from '@/api'
import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import { loggedInAccount } from '@/composables/useAuthentication'
import { getAnmeldungStatusColor } from '@/helpers/getAnmeldungStatusColors'
import { AnmeldungStatus, AnmeldungStatusMapping, getEnumOptions } from '@codeanker/api/src/enumMappings'
import { dayjs } from '@codeanker/helpers'

const props = withDefaults(
  defineProps<{
    personId: number
  }>(),
  {}
)

const { state: anmeldungenPerson } = useAsyncState(
  async () => {
    return await apiClient.anmeldung.gliederungGet.query({ personId: props.personId })
  },
  null,
  {
    immediate: true,
  }
)

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

const isStatusChangeAvailable = (anmeldung) => {
  if (loggedInAccount.value?.role === 'ADMIN') {
    return true
  }
  if (anmeldung.unterveranstaltung.veranstaltung.meldeschluss < new Date()) {
    return false
  }
}

const setStatus = async (anmeldung, status) => {
  if (status == AnmeldungStatus.BESTAETIGT) {
    await apiClient.anmeldung.verwaltungAnnehmen.mutate({
      anmeldungId: anmeldung.id,
    })
  }
  if (status == AnmeldungStatus.STORNIERT) {
    // @ToDo
  }
  if (status == AnmeldungStatus.ABGELEHNT) {
    // @ToDo
  }
}
</script>

<template>
  <div v-if="anmeldungenPerson">
    <div
      v-for="anmeldung in anmeldungenPerson"
      :key="anmeldung.id"
      class="flex justify-between items-center py-4 border-t border-b border-gray-200"
    >
      <div>
        <div class="flex space-x-1 items-center">
          <span>{{ anmeldung.unterveranstaltung.veranstaltung.name }}</span>
          <RouterLink
            target="_blank"
            class="text-primary-600 hover:text-primary-700"
            :to="{
              name: 'UnterveranstaltungDetail',
              params: { unterveranstaltungId: anmeldung.unterveranstaltung.id },
            }"
          >
            <ArrowTopRightOnSquareIcon class="h-4 w-4" />
          </RouterLink>
        </div>
        <span class="text-gray-500 text-sm"
          >angemeldet am {{ dayjs(anmeldung.createdAt).format('DD.MM.YYYY') }} um
          {{ dayjs(anmeldung.createdAt).format('hh:mm') }}</span
        >
      </div>
      <div v-if="anmeldung.tshirtBestellt">T-Shirt Größe {{ anmeldung.person.konfektionsgroesse }}</div>
      <div>
        <BasicDropdown
          :right="false"
          :append="true"
          class="w-full"
          :disabled="!isStatusChangeAvailable(anmeldung)"
          button-style="w-full min-w-52 text-left"
        >
          <template #buttonContent>
            <button
              type="button"
              class="input-style w-full block text-left flex justify-between items-center"
              :class="[!isStatusChangeAvailable(anmeldung) ? 'cursor-not-allowed' : 'hover:cursor-pointer']"
            >
              <slot>
                <div class="flex space-x-2 items-center">
                  <div
                    class="w-4 h-4 rounded-full shrink-0"
                    :class="`bg-${getAnmeldungStatusColor(anmeldung?.status)}-600`"
                  ></div>
                  <span>{{ getStatusHuman(anmeldung?.status) }}</span>
                </div>
              </slot>
              <ChevronDownIcon
                v-if="isStatusChangeAvailable(anmeldung)"
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
                v-for="status in availableOptions"
                :key="status.value"
                type="button"
                class="hover:bg-primary-light rounded items-center flex p-2 w-full space-x-2 text-left"
                @click="(anmeldung.status = status.value) && setStatus(anmeldung, status.value)"
              >
                <div
                  class="w-4 h-4 rounded-full shrink-0"
                  :class="`bg-${getAnmeldungStatusColor(status.value)}-600`"
                ></div>
                <div>
                  <div>{{ status.label }}</div>
                  <div class="text-xs text-gray-500">{{ status.description }}</div>
                </div>
              </button>
            </MenuItem>
          </template>
        </BasicDropdown>
      </div>
    </div>
  </div>
  <div v-if="!anmeldungenPerson || anmeldungenPerson.length <= 0">
    Die Person hat sich zu keiner Veranstaltung angemeldet
  </div>
</template>
