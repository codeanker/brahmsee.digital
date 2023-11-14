<template>
  <div class="container mb-32 mt-12">
    <img
      class="mx-auto w-1/2 p-5"
      src="/codeanker.png"
      alt="Codeanker Logo"
    />
    <ValidateForm
      ref="form"
      class="grid grid-cols-2 gap-6"
    >
      <BasicCheckbox
        id="checkbox"
        v-model="basicCheckbox"
        name="checkbox"
        label="BasicCheckbox"
        required
      />
      <pre>{{ basicCheckbox }}</pre>
      <BasicDatepicker
        id="BasicDatepicker"
        v-model="basicDatepicker"
        required
        multi-calendars="2"
        range
        auto-range="5"
        :preset-ranges="presetRanges"
        :markers="markers"
        label="BasicDatepicker"
      />
      <pre>{{ basicDatepicker }}</pre>
      <BasicInput
        id="BasicInput"
        v-model="basicInput"
        label="BasicInput"
        required
      />
      <pre>{{ basicInput }}</pre>
      <BasicInput
        id="BasicInputEmail"
        v-model="basicInputEmail"
        label="BasicInput type email"
        type="email"
        required
        :rules="[emailValid]"
      />
      <pre>{{ basicInputEmail }}</pre>
      <BasicPassword
        id="BasicPassword"
        v-model="basicPassword"
        label="BasicPassword"
        required
      />
      <pre>{{ basicPassword }}</pre>
      <BasicSelect
        id="BasicSelect"
        v-model="basicSelect"
        :options="[
          {
            label: 'test11',
            value: 'test1',
          },
          { label: 'test22', value: 'test2' },
          { label: 'test33', value: 'test3' },
        ]"
        label="BasicSelect"
        required
      />
      <pre>{{ basicSelect }}</pre>
      <BasicSwitch
        id="BasicSwitch"
        v-model="basicSwitch"
        name="basicSwitch"
        label="BasicSwitch"
        required
        :rules="[required({ allowFalse: true })]"
      />
      <pre>{{ basicSwitch }}</pre>
      <BasicTextArea
        v-model="basicTextArea"
        label="Beschreibung"
        required
      />
      <pre>{{ basicTextArea }}</pre>
      <BasicTypeahead
        id="BasicTypeahead"
        v-model="basicTypeahead"
        placeholder="BasicTypeahead"
        label="BasicTypeahead"
        :input-formatter="(result) => result?.name"
        :result-formatter="(result) => result.name"
        strict
        :query="queryObject"
        required
      />
      <pre>{{ basicTypeahead }}</pre>
      <BasicTypeahead
        id="BasicTypeaheadString"
        v-model="basicTypeaheadString"
        strict
        placeholder="BasicTypeaheadString"
        label="BasicTypeaheadString"
        sync
        :query="(searchTerm) => ['fuu', 'bar', 'baz'].filter((result) => !searchTerm || result.includes(searchTerm))"
        required
      >
        <template #default="{ item, active, selected }">
          <li :class="['relative cursor-pointer select-none px-3 py-2 text-gray-900', { 'bg-gray-100': active }]">
            <span :class="['block truncate', selected && 'font-semibold']">
              {{ item }}
            </span>
          </li>
        </template>
      </BasicTypeahead>
      <pre>{{ basicTypeaheadString }}</pre>
      <button
        class="btn btn-primary"
        type="button"
        @click="form?.validate()"
      >
        validate
      </button>
    </ValidateForm>
    <h4 class="mt-12">HeadlessUI</h4>
    <p>HeadlessUI kann auch verwendet werden. Hier ein Beispiel</p>
    <Beispiel></Beispiel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import BasicSwitch from '@/components/BasicInputs/BasicSwitch.vue'
import BasicTextArea from '@/components/BasicInputs/BasicTextArea.vue'
import BasicTypeahead from '@/components/BasicInputs/BasicTypeahead.vue'
import Beispiel from '@/components/Beispiel.vue'
import { ValidateForm } from '@codeanker/validation'
import { required, emailValid } from '@codeanker/validation/rules'

const basicCheckbox = ref(true)
const basicDatepicker = ref([])
const basicInput = ref('')
const basicInputEmail = ref('info@codeanker.de')
const basicPassword = ref('')
const basicSelect = ref('')
const basicSwitch = ref(true)
const basicTextArea = ref('')
const basicTypeaheadString = ref('Freitext')
const foos = [{ name: 'fuu' }, { name: 'bar' }, { name: 'baz' }]
const basicTypeahead = ref(foos[0])

const form = ref<InstanceType<typeof ValidateForm>>()
const presetRanges = ref([
  { label: 'Heute ne Woche', range: [new Date(), new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)] },
])
const markers = ref<InstanceType<typeof BasicDatepicker>['markers']>([
  {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000),
    type: 'dot',
    tooltip: [{ text: 'Dot with tooltip', color: 'green' }],
  },
  {
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    type: 'line',
    tooltip: [
      { text: 'First tooltip', color: 'blue' },
      { text: 'Second tooltip', color: 'yellow' },
    ],
  },
  {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    type: 'dot',
    color: 'yellow',
  },
])

async function queryObject(searchTerm) {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return foos.filter((result) => result?.name.includes(searchTerm))
}
</script>
