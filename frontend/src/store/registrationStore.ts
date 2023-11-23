import { createGlobalState, useAsyncState, useStorage } from '@vueuse/core'
import { unref } from 'vue'

import { apiClient } from '../api'

import { type RouterInput } from '@codeanker/api'

export const useCreateRegistrationState = createGlobalState(() => {
  const defaultRegistrationState: Partial<RouterInput['user']['registrationCreate']['data']> = {}
  const user = useStorage('registration-user-store', defaultRegistrationState)
  const approvePassword = useStorage('registration-approve-password-store', '')

  const {
    isLoading: isCreatePending,
    error: createUserError,
    execute: createUser,
  } = useAsyncState(
    async () => apiClient.user.registrationCreate.mutate(unref(user) as RouterInput['user']['registrationCreate']),
    null,
    {
      immediate: false,
    }
  )

  function resetState() {
    user.value = defaultRegistrationState
  }

  return {
    user,
    approvePassword,
    createUserError,
    isCreatePending,
    resetState,
    createUser,
  }
})
