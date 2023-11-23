<template>
  <BasicFormGroup
    :id="id"
    :name="name"
    :label="label"
    :error-message="errorMessage"
  >
    <VueDatePicker
      :id="id || name || label"
      v-model="model"
      :name="id || name || label"
      :placeholder="placeholder || label || name"
      :class="{ 'rounded-r-none': $slots.append }"
      input-class-name="input-style"
      :range="range"
      :auto-range="autoRange"
      :multi-calendars="multiCalendars"
      :month-picker="monthPicker"
      :time-picker="timePicker"
      :year-picker="yearPicker"
      :week-picker="weekPicker"
      :text-input="textInput"
      :inline="inline"
      :multi-dates="multiDates"
      :flow="flow"
      :utc="utc"
      :vertical="vertical"
      :model-auto="modelAuto"
      :timezone="timezone"
      :preset-ranges="presetRanges"
      :close-on-scroll="closeOnScroll"
      :auto-apply="autoApply"
      :markers="markers"
    />
  </BasicFormGroup>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'

import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'
import { type BasicInputDefaultProps } from './defaultProps'

const props = defineProps<
  BasicInputDefaultProps<typeof VueDatePicker.modelValue> & {
    range?: boolean
    autoRange?: typeof VueDatePicker.autoRange
    multiCalendars?: typeof VueDatePicker.multiCalendars
    monthPicker?: boolean
    timePicker?: boolean
    yearPicker?: boolean
    weekPicker?: boolean
    textInput?: boolean
    inline?: boolean
    multiDates?: boolean
    flow?: typeof VueDatePicker.flow
    utc?: typeof VueDatePicker.utc
    vertical?: boolean
    modelAuto?: boolean
    timezone?: string
    presetRanges?: typeof VueDatePicker.presetRanges
    closeOnScroll?: boolean
    autoApply?: boolean
    markers?: typeof VueDatePicker.markers
  }
>()

const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: typeof VueDatePicker.modelValue | undefined): void
}>()

const { model, errorMessage } = useValidationModel<typeof VueDatePicker.modelValue>(props, emit)
</script>
