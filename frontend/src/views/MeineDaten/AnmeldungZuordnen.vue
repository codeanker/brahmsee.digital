<script setup lang="ts">
import { apiClient } from '@/api'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import Button from '@/components/UIComponents/Button.vue'
import { ValidateForm } from '@codeanker/validation'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const zuordnungscode = ref('')
const errorMessage = ref<string>()

function validateUUID(input: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input)
}

async function onSubmit() {
  if (!validateUUID(zuordnungscode.value)) {
    errorMessage.value = 'Die Eingabe hat ein falsches Format!'
    return
  }

  try {
    await apiClient.anmeldung.zuordnen.mutate(zuordnungscode.value)
    router.push({ name: 'Meine Anmeldungen' })
  } catch (error) {
    console.error(error)
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class="my-4 flex items-center justify-between">
    <div>
      <p class="text-xl font-bold">Anmeldungen</p>
      <p class="text-sm">Hier findest Du alle deine Anmeldungen.</p>
    </div>
  </div>

  <p>Hier kannst du deinem Account weitere Anmeldungen zuordnen.</p>
  <p>
    Dafür benötigst du einen <b>Zuordnungscode</b>, welcher ungefähr so aussieht:
    <u>12345678-abcd-abcd-abcd-1234567890ab</u>
  </p>

  <ValidateForm
    class="my-8 gap-y-8 flex flex-col lg:w-1/3"
    @submit="onSubmit"
  >
    <BasicInput
      v-model="zuordnungscode"
      label="Zuordnungscode"
      placeholder="12345678-abcd-abcd-abcd-1234567890ab"
      required
    />

    <Button type="submit">Zuordnungscode prüfen</Button>

    <p
      v-if="errorMessage"
      class="text-red-500 font-medium"
    >
      {{ errorMessage }}
    </p>
  </ValidateForm>
</template>
