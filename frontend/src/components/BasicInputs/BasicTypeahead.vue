<template>
  <div>
    <label
      v-if="label"
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
      :debounce-time="debounceTime"
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
import useValidatedModel from '../../composables/useValidatedModel'

import BasicValidationFeedback from './components/BasicValidationFeedback.vue'
import Typeahead from './components/Typeahead.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = withDefaults(
  defineProps<
    BasicInputDefaultProps<InstanceType<typeof Typeahead>['modelValue']> & {
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
      debounceTime?: InstanceType<typeof Typeahead>['debounceTime']
    }
  >(),
  {
    tag: 'input',
    inputFormatter: () => (result) => result,
    resultFormatter: () => (result) => result,
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: string | object | null | undefined): void
}>()
const { model, errorMessage } = useValidatedModel(props, emit)
</script>
