<script setup lang="ts">
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/vue'
import { computed, ref, watch } from 'vue'

import { debounce } from '@/helpers/debounce'

type QueryResult = any[] | { data: any[] }

const props = withDefaults(
  defineProps<{
    query: (term: string, controller: AbortController) => Promise<QueryResult> | QueryResult

    modelValue: object | string | null | undefined
    /** Formatiert das ausgewählte Query-Ergebnis zu einem String, der in das Input geschrieben wird */
    inputFormatter?: (value: any) => string
    /** Formatiert die Query-Ergebnisse zu Strings, die in der Auswahl angezeigt werden */
    resultFormatter?: (value: any) => string
    debounceTime?: number
    /** Flag, die dafür sorgt, dass sofort bei Seitenaufruf schonmal gesucht wird */
    immediate?: boolean
    /** Flag, die gesetzt werden kann, wenn die query nicht async ist. Debounce wird geskipped */
    sync?: boolean
    /** Ob ein Ergebnis von der Query ausgewählt werden muss oder ob auch ein Freitext erlaubt ist */
    strict?: boolean
    label?: string
    name?: string
    disabled?: boolean
    placeholder?: string
  }>(),

  {
    inputFormatter: () => (result) => result,
    resultFormatter: () => (result) => result,
    debounceTime: 200,
  }
)
const emit = defineEmits<{
  'update:modelValue': (eventArgs: string | object | null | undefined) => void
}>()

// Bei Seitenaufrufs
if (props.immediate) {
  filterItems()
}

/** Der Suchbegriff und Inhalt des Inputs des Typeaheads. Wird mit dem formatierten modelValue initialisiert */
const searchTerm = ref(props.inputFormatter(props.modelValue) || '')

/** Das Model, das mit dem ausgewählten Query Erbebnis befüllt wird oder wenn strict false ist mit dem searchTerm */
const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

/** Wird aufgerufen, wenn der Nutzer eine eingabe tätigt */
function updateSearchTerm(event) {
  searchTerm.value = event.target.value

  if (!props.strict) model.value = event.target.value
  filterItems(searchTerm.value)
}

/** Pending State der Query */
const pending = ref(false)

/** Das Query-Ergebnis */
const items = ref<(string | number | boolean | object | null | undefined)[]>([])

/** Der controller der letzten Query */
let lastSearchController: AbortController | undefined

/**
 * Id der letzen Query, damit kann man überprüfen, ob ein Ergebnis von der letzten Query stammt oder
 * ob wegen einer race condition das Ergebnis einer Query davor angekommen ist
 */
let lastSearchId: symbol | undefined

/** Stößt die Query an, die ausgeführt wird sobald der debounce abgelaufen ist */
function filterItems(searchTerm = '') {
  pending.value = true
  debounceFilterItems(searchTerm)
}

/** Führt die query aus und schreibt das Ergebnis auf items */
const debounceFilterItems = debounce(
  async function (searchTerm = '') {
    // Wenn eine Query durchgeführt wird, wird der Request der letzten Query gecancelled
    if (lastSearchController) {
      lastSearchController.abort()
    }

    const newSearchController = new AbortController() // Der controller für die neue Query
    lastSearchController = newSearchController // Der controller der neuen Query wird aktueller controller registriert

    const newSearchId = Symbol() // Generiert eine ID für die Query
    lastSearchId = newSearchId // Die ID der aktuellen Query wird als letzte Query gesetzt

    const request = await props.query(searchTerm, newSearchController)

    if (lastSearchId !== newSearchId) {
      // Wenn die Query nicht mehr die aktuelle Query ist, wird das Ergebnis verworfen
      return
    }

    if (Array.isArray(request)) {
      items.value = request // nicht paginated Ergebnisse
    } else {
      items.value = request.data // paginated Ergebnisse
    }
    pending.value = false
  },
  props.sync ? 0 : props.debounceTime
)

/** Wenn ein Ergebnis gewählt wird, wird der searchTerm mit dem formatierten Wert geupdated */
watch(
  () => model.value,
  () => {
    searchTerm.value = props.inputFormatter(model.value)
  }
)

/** resetted das model, durch das watch wird auch der searchTerm geupdated */
function clear() {
  model.value = null
}

/** Escaped die tags in dem text und verhindert so xss attacks */
function sanitize(text) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
/** Escaped Sonderzeichen in dem text und verhindert so xss attacks */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Hebt die Teile in dem Suchergebnis hervor, die mit dem Suchbegriff übereinstimmen */
const highlight = computed(() => {
  return (text) => {
    let val = '' + text
    if (typeof val !== 'string') return ''
    val = sanitize(val)
    if (!searchTerm.value || searchTerm.value.length === 0) {
      return val
    }
    const terms = escapeRegExp(sanitize(searchTerm.value))
      .split(' ')
      .filter((item) => !!item)
    for (const term of terms) {
      const re = new RegExp(term, 'gi')
      val = val.replace(re, '<strong>$&</strong>')
    }
    return val
  }
})
</script>

<template>
  <div>
    <Combobox v-model="model">
      <div class="relative">
        <ComboboxInput
          class="input-style"
          :disabled="disabled"
          :placeholder="placeholder || label || name"
          :display-value="inputFormatter"
          @change="updateSearchTerm"
        />
        <div class="absolute inset-y-0 right-2 flex items-center">
          <button
            v-if="model"
            type="button"
            class="bg-transparent px-1"
            @click="clear"
          >
            <!-- <FontAwesomeIcon
              :icon="faTimes"
              fixed-width
              class="text-gray-500"
            /> -->
          </button>
          <ComboboxButton
            class="bg-transparent px-1"
            @click="filterItems(searchTerm)"
          >
            <!-- <FontAwesomeIcon
              :icon="pending ? faSpinner : faChevronDown"
              fixed-width
              class="text-gray-500"
              :spin="pending"
            /> -->
          </ComboboxButton>
        </div>
        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ComboboxOptions
            v-if="items.length > 0"
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ComboboxOption
              v-for="(item, index) of items"
              :key="'item' + index"
              v-slot="{ active, selected }"
              :value="item"
            >
              <slot v-bind="{ item, active, selected }">
                <li
                  :class="[
                    'relative cursor-pointer select-none px-3 py-2',
                    active ? 'bg-primary-600 text-white' : 'text-gray-900',
                  ]"
                >
                  <!-- eslint-disable vue/no-v-html -->
                  <span
                    :class="['block truncate', selected && 'font-semibold']"
                    v-html="highlight(resultFormatter(item))"
                  />
                  <!-- eslint-enable vue/no-v-html -->
                  <span
                    v-if="selected"
                    :class="[
                      'absolute inset-y-0 right-0 flex items-center pr-4',
                      active ? 'text-white' : 'text-primary-600',
                    ]"
                  >
                    <!-- <FontAwesomeIcon
                      :icon="faCheck"
                      fixed-width
                    /> -->
                  </span>
                </li>
              </slot>
            </ComboboxOption>
          </ComboboxOptions>
        </transition>
      </div>
    </Combobox>
  </div>
</template>
