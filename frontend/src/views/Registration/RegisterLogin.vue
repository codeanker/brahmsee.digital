<script setup lang="ts">
import { useRouter } from 'vue-router'

import RegistrationLayout from './components/RegistrationLayout.vue'

import BasicInput from '@/components/BasicInputs/BasicInput.vue'
import BasicPassword from '@/components/BasicInputs/BasicPassword.vue'
import { useCreateRegistrationState } from '@/store/registrationStore'

const router = useRouter()
const { user, approvePassword } = useCreateRegistrationState()
</script>

<template>
  <RegistrationLayout @back="router.replace({ name: 'RegistrationStart' })">
    <BasicInput
      v-model="user.email"
      placeholder="E-Mail"
      name="mail"
      class="mt-4"
    />
    <BasicPassword
      v-model="user.password"
      placeholder="Passwort"
      name="password"
      class="mt-4"
    ></BasicPassword>
    <BasicPassword
      v-model="approvePassword"
      placeholder="Passwort bestätigen"
      name="approvePassword"
      class="mt-4"
    ></BasicPassword>
    <!-- <BasicInput
      v-model="user.mobile"
      placeholder="Rufnummer"
      name="rufnummer"
      class="mt-4"
    >
    </BasicInput> -->

    <button
      type="button"
      class="btn btn-primary absolute bottom-10 right-7 px-12"
      @click="router.push({ name: 'RegisterUsername' })"
    >
      Weiter
    </button>
  </RegistrationLayout>
</template>
