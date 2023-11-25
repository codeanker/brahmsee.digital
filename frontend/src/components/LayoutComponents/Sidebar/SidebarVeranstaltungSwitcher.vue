<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'
import { useAsyncState } from '@vueuse/core'
import { ref, type Ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { apiClient } from '@/api'

const emit = defineEmits<{
  (event: 'setVeranstaltung', eventArgs: number): void
}>()
const route = useRoute()
const router = useRouter()

const { state: veranstaltungen } = useAsyncState(async () => {
  return apiClient.veranstaltung.verwaltungList.query({ filter: {}, pagination: { take: 100, skip: 0 } })
}, [])

let selectedVeranstaltung: Ref<number> = ref(+route.params.veranstaltungId)
const veranstaltungTitle = (id: number) => {
  return veranstaltungen.value.find((veranstaltung) => veranstaltung.id === id)?.name
}
watch(selectedVeranstaltung, (newValue) => {
  localStorage.setItem('letzteVeranstaltung', newValue.toString())
  emit('setVeranstaltung', newValue)
  router.push({ params: { veranstaltungId: newValue.toString() } })
})
</script>

<template>
  <div class="mb-4">
    <Listbox v-model="selectedVeranstaltung">
      <ListboxButton
        class="text-white bg-primary-600 hover:bg-primary-500 focus:outline-primary-600 btn w-full rounded-xl flex items-center space-x-3 text-left"
      >
        <div class="shrink-0 h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            class="h-5 aspect-square text-primary-600"
            fill="currentColor"
          >
            <path
              d="M278.9 2.8c5.5-3.8 12.7-3.8 18.2 0L517.3 154.7c11.3 7.8 18.7 20 20.4 33.6L571.4 458c3.6 28.6-18.8 54-47.6 54H52.2C23.4 512 1 486.7 4.6 458L38.3 188.2c1.7-13.6 9.1-25.8 20.4-33.6L278.9 2.8zM76.9 181c-3.8 2.6-6.2 6.7-6.8 11.2L36.4 462c-1.2 9.5 6.3 18 15.9 18H272V46.5L76.9 181zM405.4 480L304 288.4V480H405.4zm36.2 0h82.1c9.6 0 17.1-8.4 15.9-18L505.9 192.2c-.6-4.5-3-8.6-6.8-11.2L304 46.5V220L441.6 480z"
            />
          </svg>
        </div>
        <div class="grow text-white leading-3">
          <p class="text-sm font-normal text-primary-200 mb-0">Veranstaltung</p>
          <h6 class="mb-1">{{ veranstaltungTitle(selectedVeranstaltung) }}</h6>
        </div>
        <div class="flex-shrink-0">
          <ChevronDownIcon class="w-6 h-6"></ChevronDownIcon>
        </div>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="veranstaltung in veranstaltungen"
            :key="veranstaltung.id"
            v-slot="{ active, selected }"
            :value="veranstaltung.id"
            as="template"
          >
            <li
              :class="[
                active ? 'bg-primary-600 text-white' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-3 pr-9',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                veranstaltung.name
              }}</span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-primary-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon
                  class="h-5 w-5"
                  aria-hidden="true"
                />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </Listbox>
  </div>
</template>
