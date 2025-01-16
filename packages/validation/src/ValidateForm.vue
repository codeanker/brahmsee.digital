<script setup lang="ts">
import { Form } from 'vee-validate'
import { ref } from 'vue'

const emit = defineEmits<{
  submit: () => void
}>()

const form = ref<InstanceType<typeof Form>>()

async function validate({ scrollIntoView = true } = {}) {
  if (!form.value) return
  const validationResult = await form.value.validate()
  if (!validationResult.valid) {
    const errors = validationResult.errors
    const errorKeys = Object.keys(errors)
    if (scrollIntoView) {
      const firstErrorKey = errorKeys.find((key) => {
        const errorByKey = errors[key]
        return errorByKey && errorByKey.length > 0
      })
      const label = document.querySelector(`label[for="${firstErrorKey}"]`)
      const element = document.querySelector(`*[data-error-scroll-anchor="${firstErrorKey}"]`)
      const scrollToElement = label || element
      scrollToElement?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }
  return validationResult
}
async function reset() {
  await form.value?.resetForm()
}
defineExpose({
  validate,
  reset,
})
</script>

<template>
  <Form
    ref="form"
    slim
    @submit="emit('submit')"
  >
    <slot />
  </Form>
</template>
