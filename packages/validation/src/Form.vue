<template>
  <Form
    ref="form"
    slim
  >
    <slot />
  </Form>
</template>

<script setup lang="ts">
import { Form } from 'vee-validate'
import { ref } from 'vue'
const form = ref<InstanceType<typeof Form>>()

async function validate({ returnErrors = false, scrollIntoView = true } = {}) {
  if (!form.value) return
  const isValid = await form.value.validate()
  if (!isValid) {
    const errors = form.value.getErrors()
    if (!errors) true
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

    if (returnErrors)
      return errorKeys.filter((errorKey) => {
        const errorByKey = errors[errorKey]
        return errorByKey && errorByKey.length > 0
      })
  }
  if (returnErrors) return []
  else return isValid
}
async function reset() {
  await form.value?.resetForm()
}
defineExpose({
  validate,
  reset,
})
</script>
