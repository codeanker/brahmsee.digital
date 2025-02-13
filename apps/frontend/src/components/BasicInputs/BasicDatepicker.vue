<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'

import useValidationModel from '../../composables/useValidationModel'

import BasicFormGroup from './components/BasicFormGroup.vue'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    id?: string
    label?: string
    name?: string
    range?: boolean
    //eslint-disable-next-line
    modelValue: typeof VueDatePicker.modelValue
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
    required?: boolean
    modelAuto?: boolean
    timezone?: string
    presetRanges?: typeof VueDatePicker.presetRanges
    closeOnScroll?: boolean
    autoApply?: boolean
    markers?: typeof VueDatePicker.markers
    enableTimePicker?: boolean
    format?: typeof VueDatePicker.format
    modelType?: typeof VueDatePicker.modelType
    disabledDates?: {
      from?: Date
      to?: Date
    }
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
    timezone: 'Europe/Berlin',
    presetRanges: undefined,
    markers: undefined,
    autoApply: true,
    icon: undefined,
    textInput: false,
    format: 'dd.MM.yyyy',
    modelType: undefined,
  }
)
const emit = defineEmits<{
  'update:modelValue': [boolean | undefined]
}>()

const { model, errorMessage } = useValidationModel(props, emit)
</script>

<template>
  <div>
    <BasicFormGroup
      :id="id"
      :name="name"
      :label="label"
      :required="required"
      :error-message="errorMessage"
    >
      <VueDatePicker
        :id="id || name || label"
        v-model="model"
        :name="id || name || label"
        :placeholder="placeholder || label || name"
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
        :enable-time-picker="timePicker || enableTimePicker"
        :format="format"
        :model-type="modelType"
        :required="required"
        :min-date="disabledDates?.to"
        :max-date="disabledDates?.from"
        locale="de"
      />
    </BasicFormGroup>
  </div>
</template>
