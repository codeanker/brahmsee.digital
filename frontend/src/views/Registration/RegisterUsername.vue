<template>
  <RegistrationLayout @back="router.replace({ name: 'RegisterLogin' })">
    <div
      v-if="createUserError"
      class="bg-danger-400 mb-2 rounded p-3 text-center text-white"
    >
      {{ createUserError }}
    </div>
    <div class="flex flex-col">
      <img
        class="h-32 w-32 place-self-center rounded-full border-2 border-gray-200"
        src="https://picsum.photos/200"
      />
      <!-- <BasicInput
        v-model="user.username"
        placeholder="Nutzername"
        class="mt-4"
      >
      </BasicInput> -->
    </div>

    <button
      type="button"
      class="btn btn-primary absolute bottom-10 right-7 px-12"
      @click="register"
    >
      <template v-if="isCreatePending">
        <i
          class="faSpinnerThird"
          spin
          size="lg"
        ></i>
      </template>
      <template v-else>erstellen</template>
    </button>
  </RegistrationLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import RegistrationLayout from './components/RegistrationLayout.vue'

// import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import { useCreateRegistrationState } from '@/store/registrationStore'

const router = useRouter()
const { createUser, isCreatePending, createUserError } = useCreateRegistrationState()

async function register() {
  if (isCreatePending.value) return
  const response = await createUser()
  if (response) router.push({ name: 'Login' })
}
</script>
