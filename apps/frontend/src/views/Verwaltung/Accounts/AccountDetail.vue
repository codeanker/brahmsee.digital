<script setup lang="ts">
import { useAsyncState } from '@vueuse/core'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'
import FormAccountGeneral from '@/components/forms/account/FormAccountGeneral.vue'
import { loggedInAccount, logout } from '@/composables/useAuthentication'
import { useRouteTitle } from '@/composables/useRouteTitle'

const isSelf = ref(false)

const { setTitle } = useRouteTitle()

const route = useRoute()
const { state: account, execute: refetch } = useAsyncState(async () => {
  const accountId = route.params.accountId as string
  const result = await apiClient.account.verwaltungGet.query({ id: parseInt(accountId) })
  isSelf.value = result?.id === loggedInAccount.value?.person.id
  setTitle(`Account: ${result?.email}`)
  return result
}, undefined)

const onUpdate = async () => {
  if (isSelf.value) {
    await logout()
  } else {
    refetch()
  }
}
</script>

<template>
  <FormAccountGeneral
    v-if="account"
    :account="account"
    @update="onUpdate"
  />
</template>
