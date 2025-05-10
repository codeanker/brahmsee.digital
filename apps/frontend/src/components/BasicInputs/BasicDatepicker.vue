<script setup lang="ts">
import VueDatePicker, { type PartialTimeObj } from '@vuepic/vue-datepicker'

import useValidationModel from '../../composables/useValidationModel'

import { computed } from 'vue'
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

const minTime = computed<PartialTimeObj | undefined>(() => {
  if (!props.disabledDates?.to) {
    return
  }

  return {
    hours: props.disabledDates.to.getHours(),
    minutes: props.disabledDates.to.getMinutes(),
  }
})

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
        :ui="{ input: 'input-style' }"
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
        :time-picker-inline="timePicker || enableTimePicker"
        :format="format"
        :model-type="modelType"
        :required="required"
        :min-date="disabledDates?.to"
        :max-date="disabledDates?.from"
        :min-time="minTime"
        locale="de"
      />
    </BasicFormGroup>
  </div>
</template>

<style lang="scss">
@import '@vuepic/vue-datepicker/dist/main.css';

.dp__theme_light {
  --dp-background-color: rgb(241 245 249 / var(--tw-border-opacity, 1));
  --dp-text-color: rgb(15 23 42 / var(--tw-text-opacity, 1));
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: none;
  --dp-menu-border-color: none;
  --dp-border-color-hover: none;
  --dp-border-color-focus: none;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}

.dp__instance_calendar,
.dp__overlay {
  background: white;
}

:root {
  /*General*/
  --dp-font-family: 'Inter var', sans-serif;
  --dp-border-radius: 0.5rem; /*Configurable border-radius*/
  --dp-cell-border-radius: 4px; /*Specific border radius for the calendar cell*/
  --dp-common-transition: all 0.1s ease-in; /*Generic transition applied on buttons and calendar cells*/

  /*Sizing*/
  --dp-button-height: 35px; /*Size for buttons in overlays*/
  --dp-month-year-row-height: 35px; /*Height of the month-year select row*/
  --dp-month-year-row-button-size: 35px; /*Specific height for the next/previous buttons*/
  --dp-button-icon-height: 20px; /*Icon sizing in buttons*/
  --dp-cell-size: 35px; /*Width and height of calendar cell*/
  --dp-cell-padding: 5px; /*Padding in the cell*/
  --dp-common-padding: 10px; /*Common padding used*/
  --dp-input-icon-padding: 35px; /*Padding on the left side of the input if icon is present*/
  --dp-input-padding: 6px 30px 6px 12px; /*Padding in the input*/
  --dp-menu-min-width: 260px; /*Adjust the min width of the menu*/
  --dp-action-buttons-padding: 2px 5px; /*Adjust padding for the action buttons in action row*/
  --dp-row-margin: 5px 0; /*Adjust the spacing between rows in the calendar*/
  --dp-calendar-header-cell-padding: 0.5rem; /*Adjust padding in calendar header cells*/
  --dp-two-calendars-spacing: 10px; /*Space between multiple calendars*/
  --dp-overlay-col-padding: 3px; /*Padding in the overlay column*/
  --dp-time-inc-dec-button-size: 32px; /*Sizing for arrow buttons in the time picker*/
  --dp-menu-padding: 6px 8px; /*Menu padding*/

  /*Font sizes*/
  --dp-font-size: 1rem; /*Default font-size*/
  --dp-preview-font-size: 0.8rem; /*Font size of the date preview in the action row*/
  --dp-time-font-size: 0.8rem; /*Font size in the time picker*/

  /*Transitions*/
  --dp-animation-duration: 0.1s; /*Transition duration*/
  --dp-menu-appear-transition-timing: cubic-bezier(0.4, 0, 1, 1); /*Timing on menu appear animation*/
  --dp-transition-timing: ease-out; /*Timing on slide animations*/
}
</style>
