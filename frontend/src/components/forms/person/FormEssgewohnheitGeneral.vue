<script setup lang="ts">
import { MenuItem } from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import carrotRegular from '@/assets/images/icons/carrot-regular.svg'
import seedlingRegular from '@/assets/images/icons/seedling-regular.svg'
import steakRegular from '@/assets/images/icons/steak-regular.svg'
import BasicDropdown from '@/components/BasicInputs/BasicDropdown.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import {
  EssgewohnheitMapping,
  NahrungsmittelIntoleranzMapping,
  getEnumOptions,
  type NahrungsmittelIntoleranz,
} from '@codeanker/api'

export interface IEssgewohnheiten {
  essgewohnheit: keyof typeof EssgewohnheitMapping
  intoleranzen: {
    [key in NahrungsmittelIntoleranz]: boolean
  }
  weitereIntoleranzen: string[]
}

const props = withDefaults(
  defineProps<{
    modelValue: IEssgewohnheiten
  }>(),
  {}
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: IEssgewohnheiten): void
}>()

const model = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

const essgewohnheitOptions = getEnumOptions(EssgewohnheitMapping)
const nahrungsmittelIntoleranzOptions = getEnumOptions(NahrungsmittelIntoleranzMapping)
const tempWeitereInteloranzen = ref('')

const toggleOption = (option: keyof typeof NahrungsmittelIntoleranzMapping) => {
  model.value.intoleranzen[option] = !model.value.intoleranzen[option]
}

const getEssgewohnheitHuman = computed(
  () => essgewohnheitOptions.find((essgewohnheit) => essgewohnheit.value === model.value.essgewohnheit)?.label
)

const getEssgewohnheitIcon = (essgewohnheit) => {
  switch (essgewohnheit) {
    case 'OMNIVOR':
      return steakRegular
    case 'VEGETARISCH':
      return carrotRegular
    case 'VEGAN':
      return seedlingRegular
  }
}

const addWeitereIntoleranzen = () => {
  if (!tempWeitereInteloranzen.value) return
  if (model.value.weitereIntoleranzen.includes(tempWeitereInteloranzen.value)) return
  model.value.weitereIntoleranzen.push(tempWeitereInteloranzen.value)
  tempWeitereInteloranzen.value = ''
}
</script>

<template>
  <BasicDropdown
    :right="false"
    :append="true"
    class="w-full"
    label="Essgewohnheit"
    required
    button-style="w-full text-left"
  >
    <template #buttonContent>
      <button
        type="button"
        class="input-style w-full text-left flex justify-between items-center"
      >
        <slot>
          <div class="flex space-x-2 items-center">
            <img
              :src="getEssgewohnheitIcon(model.essgewohnheit)"
              class="h-5 w-5 mr-1"
            />
            <span>{{ getEssgewohnheitHuman }}</span>
          </div>
        </slot>
        <ChevronDownIcon class="h-5 text-gray-500" />
      </button>
    </template>
    <template #dropdownContent>
      <MenuItem
        as="div"
        class=""
      >
        <button
          v-for="essgewohnheit in essgewohnheitOptions"
          :key="essgewohnheit.value"
          type="button"
          class="hover:bg-primary-100 rounded items-center flex py-2 px-4 w-full space-x-2 text-left"
          @click="model.essgewohnheit = essgewohnheit.value"
        >
          <img
            :src="getEssgewohnheitIcon(essgewohnheit.value)"
            class="h-5 w-5 mr-1"
          />
          <span>{{ essgewohnheit.label }}</span>
        </button>
      </MenuItem>
    </template>
  </BasicDropdown>

  <p class="font-medium mt-5">Nahrungsmittelintoleranzen</p>
  <div class="flex flex-col gap-2">
    <div
      v-for="option in nahrungsmittelIntoleranzOptions"
      :key="option.value"
      class="bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all"
      :class="{
        'bg-secondary-200': model.intoleranzen[option.value],
      }"
      @click="toggleOption(option.value)"
    >
      <div class="flex items-center">
        {{ option.label }}
      </div>
      <CheckIcon
        v-if="model.intoleranzen[option.value]"
        class="h-5 text-primary-950"
      />
    </div>
  </div>

  <BasicInput
    v-model="tempWeitereInteloranzen"
    label="Weitere Intoleranzen"
    placeholder="Weitere Intoleranzen eingeben"
    class="mt-5"
    @keyup.enter="addWeitereIntoleranzen"
  >
    <template #append>
      <div
        class="py-2 px-4 bg-primary-200 rounded-r-lg flex items-center text-primary-800 cursor-pointer hover:bg-primary-300 transition-all"
        @click="addWeitereIntoleranzen"
      >
        <PlusIcon class="h-5 mr-2" />
        <span>Hinzufügen</span>
      </div>
    </template>
  </BasicInput>

  <div
    v-if="model.weitereIntoleranzen.length !== 0"
    class="flex flex-wrap space-x-2 mt-2"
  >
    <Badge
      v-for="(item, index) in model.weitereIntoleranzen"
      :key="item"
      class="hover:bg-red-200"
      @click.prevent="model.weitereIntoleranzen.splice(index, 1)"
    >
      {{ item }}
    </Badge>
  </div>
</template>
