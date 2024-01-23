<script setup lang="ts">
import { CheckIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { computed, ref } from 'vue'

import appleWholeRegular from '@/assets/images/icons/apple-whole-regular.svg'
import cowRegular from '@/assets/images/icons/cow-regular.svg'
import pigRegular from '@/assets/images/icons/pig-regular.svg'
import wheatAwnRegular from '@/assets/images/icons/wheat-awn-regular.svg'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import {
  EssgewohnheitMapping,
  NahrungsmittelIntoleranzMapping,
  getEnumOptions,
  type NahrungsmittelIntoleranzEnum,
} from '@codeanker/api/src/enumMappings'

export interface IEssgewohnheiten {
  essgewohnheit: keyof typeof EssgewohnheitMapping
  intoleranzen: {
    [key in NahrungsmittelIntoleranzEnum]: boolean
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

const getNahrungsmittelIcon = (NahrungsmittelIntoleranz) => {
  switch (NahrungsmittelIntoleranz) {
    case 'FRUCTOSE':
      return appleWholeRegular
    case 'LAKTOSE':
      return cowRegular
    case 'GLUTEN':
      return wheatAwnRegular
    case 'SCHWEIN':
      return pigRegular
  }
}
</script>

<template>
  <BasicSelect
    v-model="model.essgewohnheit"
    label="Essgewohnheit"
    :options="essgewohnheitOptions"
    required
  />

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
        <img
          :src="getNahrungsmittelIcon(option.value)"
          class="h-5 w-5 mr-2"
        />
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
  >
    <template #append>
      <div
        class="py-2 px-4 bg-primary-200 rounded-r-lg flex items-center text-primary-800 cursor-pointer hover:bg-primary-300 transition-all"
        @click="
          () => {
            if (!tempWeitereInteloranzen) return
            model.weitereIntoleranzen.push(tempWeitereInteloranzen)
            tempWeitereInteloranzen = ''
          }
        "
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
