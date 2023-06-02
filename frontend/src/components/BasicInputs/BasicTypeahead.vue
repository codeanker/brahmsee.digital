<template>
  <div>
    <label
      v-if="label"
      class="block text-sm font-medium leading-6 mb-2"
      :for="id || name || label"
      >{{ label }}</label
    >
    <Typeahead
      v-model="model"
      :query="query"
      :input-formatter="inputFormatter"
      :result-formatter="resultFormatter"
      :sync="sync"
      :immediate="immediate"
      :debounce="debounce"
      :strict="strict"
    >
      <template #default="slotData">
        <slot v-bind="slotData" />
      </template>
    </Typeahead>
    <BasicValidationFeedback :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { RuleFunction } from '@codeanker/validation'
import useValidatedModel from '../../composables/useValidatedModel'
import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import Typeahead from './components/Typeahead.vue'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    query: InstanceType<typeof Typeahead>['query']
    /** Formatiert das ausgewählte Query-Ergebnis zu einem String, der in das Input geschrieben wird */
    inputFormatter?: InstanceType<typeof Typeahead>['inputFormatter']
    /** Formatiert die Query-Ergebnisse zu Strings, die in der Auswahl angezeigt werden */
    resultFormatter?: InstanceType<typeof Typeahead>['resultFormatter']
    /** Flag, die gesetzt werden kann, wenn die query nicht async ist. Debounce wird geskipped */
    sync?: InstanceType<typeof Typeahead>['sync']
    /** Ob ein Ergebnis von der Query ausgewählt werden muss oder ob auch ein Freitext erlaubt ist */
    strict?: InstanceType<typeof Typeahead>['strict']
    immediate?: InstanceType<typeof Typeahead>['immediate']
    debounce?: InstanceType<typeof Typeahead>['debounce']

    id?: string
    label?: string
    name?: string
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: InstanceType<typeof Typeahead>['modelValue']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, vue/no-unused-properties
    rules?: RuleFunction[]
    // eslint-disable-next-line vue/no-unused-properties
    required?: RequiredRulesParams
  }>(),
  {
    tag: 'input',
    inputFormatter: () => (result) => result,
    resultFormatter: () => (result) => result,
  }
)
const emit = defineEmits(['update:modelValue', 'hit', 'unselect'])
const { model, errorMessage } = useValidatedModel(props, emit)
</script>
