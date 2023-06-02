import { User } from '@codeanker/api'
import { featherClient } from '@/api'
import { createGlobalState, useAsyncState, useStorage } from '@vueuse/core'
import { unref } from 'vue'

export const useCreateRegistrationState = createGlobalState(() => {
  const defaultRegistrationState: Partial<User> = {}
  const user = useStorage('registration-user-store', defaultRegistrationState)
  const approvePassword = useStorage('registration-approve-password-store', '')

  const {
    isLoading: isCreatePending,
    error: createUserError,
    execute: createUser,
  } = useAsyncState(async () => featherClient.service('users').create(unref(user) as User), null, {
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
