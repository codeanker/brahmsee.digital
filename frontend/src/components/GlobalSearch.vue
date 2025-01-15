<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import {
  ArrowLongRightIcon,
  CalendarDaysIcon,
  FingerPrintIcon,
  FolderIcon,
  GlobeEuropeAfricaIcon,
  MegaphoneIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { useAsyncState, useMagicKeys, whenever } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AppLink from './AppLink.vue'

import { apiClient } from '@/api'
import { loggedInAccount } from '@/composables/useAuthentication'
import { debounce } from '@/helpers/debounce'
import { formatDate } from '@codeanker/helpers'

const showSearch = ref(false)
const query = ref('')
const keys = useMagicKeys()

whenever(keys.control_k, () => {
  toggleSearch()
})
whenever(keys.meta_k, () => {
  toggleSearch()
})

const route = useRoute()

watch(route, () => {
  showSearch.value = false
})

defineExpose({ showSearch })

function toggleSearch() {
  showSearch.value = !showSearch.value
}

const quickActions = computed(() => {
  let actions = [
    { name: 'Neue Ausschreibung...', icon: MegaphoneIcon, url: { name: 'Verwaltung Veranstaltung erstellen' } },
  ]
  if (loggedInAccount.value?.role === 'ADMIN') {
    actions.push(
      { name: 'Neue Person...', icon: UsersIcon, url: { name: 'Verwaltung Person erstellen' } },
      { name: 'Neuer Account...', icon: FingerPrintIcon, url: { name: 'Verwaltung Account erstellen' } },
      { name: 'Neue Veranstaltung...', icon: CalendarDaysIcon, url: { name: 'Verwaltung Veranstaltung erstellen' } },
      { name: 'Neuer Ort...', icon: GlobeEuropeAfricaIcon, url: { name: 'Verwaltung Ort erstellen' } }
    )
  }
  return actions
})

const searchTerm = ref('')

function search(searchTerm: string) {
  debounceSearch(searchTerm)
}

const debounceSearch = debounce(async function (term: string) {
  searchTerm.value = term
  searchAPI()
}, 300)

const { state: searchResults, execute: searchAPI } = useAsyncState(
  async () => {
    return await apiClient.search.search.query({
      term: searchTerm.value,
    })
  },
  null,
  { immediate: false }
)
</script>

<template>
  <TransitionRoot
    :show="showSearch"
    as="template"
    appear
    @after-leave="query = ''"
  >
    <Dialog
      as="div"
      class="relative z-50"
      @close="showSearch = false"
    >
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel
            class="mx-auto max-w-2xl transform divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden rounded-xl bg-white dark:bg-dark-primary shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
          >
            <Combobox>
              <div class="relative flex">
                <MagnifyingGlassIcon
                  class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400 block"
                  aria-hidden="true"
                />
                <ComboboxInput
                  class="h-12 w-full border-0 bg-transparent !pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 focus:border-0 sm:text-sm"
                  placeholder="Suchen..."
                  @change="search($event.target.value)"
                />
              </div>

              <!-- <pre>{{ searchResults?.results }}</pre> -->

              <ComboboxOptions
                v-if="searchResults?.results.length !== 0"
                static
                class="max-h-80 scroll-py-2 divide-y divide-gray-100 dark:divide-gray-800 overflow-y-auto"
              >
                <li
                  v-for="(searchIndex, index) in searchResults?.results"
                  :key="index"
                  class="p-2"
                >
                  <h2 class="mb-2 mt-4 px-3 text-xs font-semibold text-gray-500">
                    <span v-if="searchIndex.indexUid === 'person'">Personen</span>
                  </h2>
                  <ul class="text-sm text-gray-700">
                    <ComboboxOption
                      v-for="(person, indexHits) in searchIndex.hits"
                      :key="indexHits"
                      v-slot="{ active }"
                      :value="person"
                      as="template"
                    >
                      <AppLink :to="{ name: 'Verwaltung Persondetails', params: { personId: person.id } }">
                        <li
                          :class="[
                            'flex cursor-default select-none items-center rounded-md px-3 py-2',
                            active && 'bg-primary-600 cursor-pointer group',
                          ]"
                        >
                          <UsersIcon
                            :class="['h-6 w-6 flex-none text-gray-400 group-hover:text-white dark:text-white']"
                            aria-hidden="true"
                          />
                          <div class="ml-3 flex-auto truncate highlight dark:text-white group-hover:text-white">
                            <span
                              class="mr-1"
                              v-html="person?._formatted?.firstname"
                            ></span>
                            <span v-html="person?._formatted?.lastname"></span>
                            <br />
                            <span class="text-xs">{{ formatDate(person?.birthday) }}</span>
                            <span
                              v-if="person?.birthday && person?.email"
                              class="mx-1"
                              >-</span
                            >
                            <span
                              class="text-xs"
                              v-html="person?._formatted?.email"
                            ></span>
                          </div>
                          <span
                            v-if="active"
                            class="ml-3 flex-none text-primary-100"
                            >öffnen</span
                          >
                        </li>
                      </AppLink>
                    </ComboboxOption>
                  </ul>
                </li>
                <li
                  v-if="query === ''"
                  class="p-2"
                >
                  <h2 class="sr-only">Quick actions</h2>
                  <ul class="text-sm text-gray-700">
                    <ComboboxOption
                      v-for="action in quickActions"
                      :key="action.name"
                      v-slot="{ active }"
                      :value="action"
                      as="template"
                    >
                      <AppLink :to="action.url">
                        <li
                          :class="[
                            'flex cursor-default select-none items-center rounded-md px-3 py-2',
                            active && 'bg-primary-600 text-white cursor-pointer',
                          ]"
                        >
                          <component
                            :is="action.icon"
                            :class="['h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-400 ']"
                            aria-hidden="true"
                          />
                          <span class="ml-3 flex-auto truncate dark:text-white">{{ action.name }}</span>
                          <span :class="['ml-3 flex-none text-xs font-semibold', active ? 'inline' : 'hidden']">
                            <ArrowLongRightIcon
                              class="h-5 w-5"
                              aria-hidden="true"
                            ></ArrowLongRightIcon>
                          </span>
                        </li>
                      </AppLink>
                    </ComboboxOption>
                  </ul>
                </li>
              </ComboboxOptions>

              <div
                v-if="searchResults?.results.length === 0"
                class="px-6 py-14 text-center sm:px-14"
              >
                <FolderIcon
                  class="mx-auto h-6 w-6 text-gray-400"
                  aria-hidden="true"
                />
                <p class="mt-4 text-sm text-gray-900">
                  Wir konnten leider nichts finden. <span class="highlight">Bitte versuche es noch einmal.</span>
                </p>
              </div>
            </Combobox>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<style scoped lang="scss">
:deep(.highlight) {
  em {
    @apply text-primary-600 group-hover:text-white not-italic border-b-2 border-primary-600 group-hover:border-white;
  }
}
</style>
