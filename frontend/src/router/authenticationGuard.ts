import { type NavigationGuardWithThis } from 'vue-router'

import useAuthentication from '@/composables/useAuthentication'

export default function makeGuard(): NavigationGuardWithThis<undefined> {
  return async function (to, _from, next) {
    const { loginPending, reAuthenticate, user } = useAuthentication()

    if (!user.value && !loginPending.value) {
      await reAuthenticate()
    }

    if (user.value) {
      if (to.name === 'Login') {
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    } else {
      if (to.meta.public) {
        next()
      }
      return next({ name: 'Login', query: { redirect: to.path, ...to.query } })
    }
  }
}
