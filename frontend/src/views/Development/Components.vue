<script setup lang="ts">
import { ref } from 'vue'

import ComponentPreview from './components/ComponentPreview.vue'

import BasicCheckbox from '@/components/BasicInputs/BasicCheckbox.vue'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicEditor from '@/components/BasicInputs/BasicEditor.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Badge from '@/components/UIComponents/Badge.vue'
import Button from '@/components/UIComponents/Button.vue'
import Loading from '@/components/UIComponents/Loading.vue'

let checkboxModel = ref(false)
let basicInputModel = ref('')
let basicDatepickerModel = ref('')
let basicEditorValue = ref(
  '<p>Ich bin ein <strong>Editor</strong> der als <em><s>solcher</s></em> verwendet werden kann. ich biete verschiedene <mark class="highlight">Möglichkeiten</mark>. </p>'
)

const loadingCode = `
<Loading color="primary" />
<Loading color="secondary" />
<Loading color="warning" />
<Loading color="danger" />
<div class="rounded-md bg-gray-700">
  <Loading color="white" />
</div>
<Loading size="sm" />
<Loading size="md" />
<Loading size="lg" />`
const badgeCode = `<Badge>Badge</Badge>`
const buttonCode = `
<Button :to="{ name: 'Dashboard' }">Primary Link</Button>
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>
<Button color="success">Success</Button>
<Button color="warning">Warning</Button>
<Button color="danger">Danger</Button>`
const checkboxCode = `
<!-- Minimal -->
<BasicCheckbox
  v-model="checkboxModel"
  label="Checkbox"
></BasicCheckbox>
<!-- Alle Props -->
<BasicCheckbox
  id="checkbox"
  v-model="checkboxModel"
  label="Checkbox"
  name="Checki"
  required
  disabled
></BasicCheckbox>`
const basicInputCode = `
<BasicInput
  id="BasicInput"
  v-model="basicInputModel"
  label="BasicInput"
  name="BasicInput"
  required
></BasicInput>
<BasicInput
  id="BasicInput"
  v-model="basicInputModel"
  label="BasicInput"
  name="BasicInput"
  disabled
></BasicInput>`
const basicEditorCode = `
<BasicEditor
  id="BasicEditor"
  v-model="editorValue"
  label="Beschreibung"
  name="BasicEditor"
  required
/>
`
</script>

<template>
  <div>
    <h3>Komponenten</h3>
    <h4>UI Komponenten</h4>
    <div class="space-y-12 mb-24">
      <ComponentPreview
        name="Loading"
        description="Loading component"
        :code="loadingCode"
      >
        <div class="flex items-center space-x-2">
          <Loading color="primary" />
          <Loading color="secondary" />
          <Loading color="warning" />
          <Loading color="danger" />
          <div class="rounded-md bg-gray-700">
            <Loading color="white" />
          </div>
          <Loading size="sm" />
          <Loading size="md" />
          <Loading size="lg" />
        </div>
      </ComponentPreview>
      <ComponentPreview
        name="Badge"
        description="Badge component"
        :code="badgeCode"
      >
        <div class="flex items-center space-x-2">
          <Badge>Badge</Badge>
        </div>
      </ComponentPreview>
      <ComponentPreview
        name="Button"
        description="Button component"
        :code="buttonCode"
      >
        <div class="flex items-center space-x-2">
          <Button :to="{ name: 'Dashboard' }">Primary Link</Button>
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="success">Success</Button>
          <Button color="warning">Warning</Button>
          <Button color="danger">Danger</Button>
        </div>
      </ComponentPreview>
    </div>
    <h4>BasicInputs</h4>
    <div class="space-y-12">
      <ComponentPreview
        name="BasicInput"
        description="BasicInput component"
        :code="basicInputCode"
      >
        <div class="flex items-center space-x-2">
          <BasicInput
            id="BasicInput"
            v-model="basicInputModel"
            label="BasicInput"
            name="BasicInput"
            required
          ></BasicInput>
          <BasicInput
            id="BasicInput"
            v-model="basicInputModel"
            label="BasicInput"
            name="BasicInput"
            disabled
          ></BasicInput>
        </div>
      </ComponentPreview>
      <ComponentPreview
        name="Checkbox"
        description="Checkbox component"
        :code="checkboxCode"
      >
        <div class="flex items-center space-x-2">
          <BasicCheckbox
            v-model="checkboxModel"
            label="Checkbox"
          ></BasicCheckbox>
        </div>
      </ComponentPreview>
      <ComponentPreview
        name="Checkbox"
        description="Checkbox component"
        :code="checkboxCode"
      >
        <div class="flex items-center space-x-2">
          <BasicDatepicker
            v-model="basicDatepickerModel"
            label="Datepicker"
          ></BasicDatepicker>
        </div>
      </ComponentPreview>
      <ComponentPreview
        name="BasicEditor"
        description="WYSIWYG Editor"
        :code="basicEditorCode"
      >
        <BasicEditor
          v-model="basicEditorValue"
          label="Beschreibung"
        />
      </ComponentPreview>
    </div>
  </div>
</template>
