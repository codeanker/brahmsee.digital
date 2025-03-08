<script setup lang="ts" generic="TOutput extends Record<string, any>, TSchema extends Zod.ZodSchema<TOutput>">
import { toTypedSchema } from '@vee-validate/zod'
import { Form } from 'vee-validate'
import { computed, useTemplateRef } from 'vue'
import z from 'zod'

type Props = {
  schema: TSchema
  defaultValues?: TOutput
}

const props = defineProps<Props>()

const emit = defineEmits<{
  submit: [z.infer<TSchema>]
}>()

const formSchema = toTypedSchema(props.schema, {
  async: true,
})

type FormSchema = z.infer<TSchema>

const form = useTemplateRef('form')

function onSubmit(values: FormSchema) {
  emit('submit', values)
}

const values = computed<TOutput>(() => (form.value?.values ?? {}) as TOutput)

defineExpose({
  form,
  values,
})
</script>

<template>
  <Form
    ref="form"
    :validation-schema="formSchema"
    :initial-values="props.defaultValues"
    @submit="(values) => onSubmit(values as FormSchema)"
  >
    <slot />
  </Form>
</template>
