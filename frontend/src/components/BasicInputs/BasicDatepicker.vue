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
      :format="format"
    />
  </BasicFormGroup>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import useValidatedModel from '../../composables/useValidatedModel'
import BasicFormGroup from './components/BasicFormGroup.vue'
import { RuleFunction } from '@codeanker/validation'
import { RequiredRulesParams } from '@codeanker/validation/rules'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    id?: string
    label?: string
    name?: string
    // eslint-disable-next-line vue/no-unused-properties
    modelValue: typeof VueDatePicker.modelValue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, vue/no-unused-properties
    rules?: RuleFunction[]
    // eslint-disable-next-line vue/no-unused-properties
    required?: RequiredRulesParams
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
    format?: string
  }>(),
  {
    placeholder: undefined,
    id: undefined,
    label: undefined,
    name: undefined,
    rules: undefined,
    required: false,
    autoRange: undefined,
    multiCalendars: false,
    flow: undefined,
    utc: false,
    timezone: undefined,
    presetRanges: undefined,
    markers: undefined,
    autoApply: true,
  }
)
const emit = defineEmits(['update:modelValue'])

const { model, errorMessage } = useValidatedModel<typeof VueDatePicker.modelValue>(props, emit)
</script>
