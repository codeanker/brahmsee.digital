<script setup lang="ts">
import { Document } from '@tiptap/extension-document'
import { Highlight } from '@tiptap/extension-highlight'
import { Link } from '@tiptap/extension-link'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { StarterKit } from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import { useVModel } from '@vueuse/core'
import { toRef, watch } from 'vue'

import BasicEditorMenu from './components/BasicEditorMenu.vue'
import { type BasicInputDefaultProps } from './defaultProps'

import { InputWrapper } from '@codeanker/core-ui-components'
import { useValidatedModel } from '@codeanker/core-validation'

const props = withDefaults(
  defineProps<
    BasicInputDefaultProps<string> & {
      disableValidation?: boolean
    }
  >(),
  {
    autocapitalize: 'off',
    inputClass: '',
    disableValidation: false,
  }
)
const emit = defineEmits<{
  (event: 'update:modelValue', eventArgs: string | undefined): void
  (event: 'focus'): void
  (event: 'blur'): void
}>()
const { model, errorMessage } = props.disableValidation
  ? {
      model: useVModel(props, 'modelValue', emit),
      errorMessage: undefined,
    }
  : useValidatedModel(
      {
        modelValue: toRef(props, 'modelValue'),
        label: toRef(props, 'label'),
        name: toRef(props, 'name'),
        required: toRef(props, 'required'),
        rules: toRef(props, 'rules'),
      },
      emit
    )

const editor = new Editor({
  extensions: [
    StarterKit,
    Document,
    Paragraph,
    Text,
    Highlight.configure({
      HTMLAttributes: {
        class: 'highlight',
      },
    }),
    Link.configure({
      protocols: ['https', 'http', 'mailto', 'tel'],
      linkOnPaste: true,
      HTMLAttributes: {
        class: 'link',
      },
    }),
  ],
  content: props.modelValue,
  onUpdate: () => {
    model.value = editor.getHTML()
  },
})

watch(
  () => props.modelValue,
  (value) => {
    const isSame = editor.getHTML() === value
    if (isSame) {
      return
    }
    editor.commands.setContent(value || '', false)
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <InputWrapper
    :id="id"
    :name="name"
    :label="label"
    :required="required"
    :error-message="errorMessage"
  >
    <div
      v-if="editor"
      class="rounded-md border border-gray-300 dark:border-gray-700"
    >
      <BasicEditorMenu :editor="editor" />
      <div class="p-2 min-h-">
        <EditorContent :editor="editor" />
      </div>
    </div>
  </InputWrapper>
</template>

<style lang="scss" scoped>
:deep(.ProseMirror) {
  padding: 0.4em 0.66em;
  min-height: 10em;
  word-break: auto-phrase;

  &:focus,
  &:focus-visible {
    outline: none;
  }

  ol {
    @apply list-decimal;
  }
  ul {
    @apply list-disc;
  }

  ol,
  ul {
    @apply pl-4;
  }

  .highlight {
    @apply bg-primary-100 p-0.5 rounded-sm text-primary-800;
  }

  .link {
    @apply text-primary-600 underline cursor-pointer;
  }
}
</style>
