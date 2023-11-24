import { type NavigationGuardWithThis } from 'vue-router'

import { loginPending, reAuthenticate, loggedInAccount } from '@/composables/useAuthentication'

export default function makeGuard(): NavigationGuardWithThis<undefined> {
  return async function (to, _from, next) {
    if (!loggedInAccount.value && !loginPending.value) {
      await reAuthenticate()
    }

    if (loggedInAccount.value) {
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
