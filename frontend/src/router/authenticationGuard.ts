import { type NavigationGuardWithThis } from 'vue-router'

import { loginPending, reAuthenticate, loggedInUser } from '@/composables/useAuthentication'

export default function makeGuard(): NavigationGuardWithThis<undefined> {
  return async function (to, _from, next) {
    if (!loggedInUser.value && !loginPending.value) {
      await reAuthenticate()
    }

    if (loggedInUser.value) {
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
