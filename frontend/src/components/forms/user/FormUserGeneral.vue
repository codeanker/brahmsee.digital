<template>
  <div>
    <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
      <div class="sm:col-span-3">
        <BasicInput
          v-model="userCopy.firstname"
          label="Vorname"
          name="firstname"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicInput
          v-model="userCopy.lastname"
          label="Nachname"
          name="lastname"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicDatepicker
          label="Geburtsdatum"
          name="birthdate"
          required
        />
      </div>

      <div class="sm:col-span-3">
        <BasicSelect
          label="Geschlecht"
          name="sex"
          :options="[
            {
              label: 'männlich',
              value: 'male',
            },
            {
              label: 'weiblich',
              value: 'female',
            },
            {
              label: 'Divers',
              value: 'divers',
            },
          ]"
        />
      </div>

      <div class="col-span-full">
        <BasicInput
          v-model="userCopy.email"
          label="Email"
          name="email"
          type="email"
          required
        />
      </div>
    </div>

    <div class="mt-8 flex gap-4">
      <Button
        type="reset"
        color="warning"
        @click="reset"
      >
        Zurücksetzen
      </Button>
      <Button
        type="submit"
        color="primary"
        @click="updateUser"
      >
        Speichern
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiClient } from '@/api'
import BasicDatepicker from '@/components/BasicInputs/BasicDatepicker.vue'
import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicSelect from '@/components/BasicInputs/BasicSelect.vue'
import Button from '@/components/Button.vue'
import useAuthentication from '@/composables/useAuthentication'
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'

const { reAuthenticate } = useAuthentication()

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isSelf: boolean
}

const props = defineProps<Props>()
const userCopy = ref(props.user)

const { execute: updateUser } = useAsyncState(async () => {
  await apiClient.user.update.mutate({
    id: userCopy.value.id,
    firstname: userCopy.value.firstname,
    lastname: userCopy.value.lastname,
    email: userCopy.value.email,
  })

  if (props.isSelf) {
    await reAuthenticate()
  }
}, [])

const reset = () => {
  userCopy.value = props.user
}
</script>
