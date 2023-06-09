import { createGlobalState, useAsyncState, useStorage } from '@vueuse/core'
import { unref } from 'vue'
import { apiClient } from '../api'
import { RouterInput } from '@codeanker/api'

export const useCreateRegistrationState = createGlobalState(() => {
  const defaultRegistrationState: Partial<RouterInput['user']['create']> = {}
  const user = useStorage('registration-user-store', defaultRegistrationState)
  const approvePassword = useStorage('registration-approve-password-store', '')

  const {
    isLoading: isCreatePending,
    error: createUserError,
    execute: createUser,
  } = useAsyncState(async () => apiClient.user.create.mutate(unref(user) as RouterInput['user']['create']), null, {
    immediate: false,
  })

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
