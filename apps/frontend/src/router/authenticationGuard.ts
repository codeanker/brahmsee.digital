import { type NavigationGuardWithThis } from 'vue-router'

import { loggedInAccount, reAuthenticate } from '@/composables/useAuthentication'

export default function makeGuard(): NavigationGuardWithThis<undefined> {
  return async function (to, _from, next) {
    if (!loggedInAccount.value && localStorage.getItem('jwt') !== null) {
      await reAuthenticate()
    }
    if (loggedInAccount.value) {
      if (to.name === 'Login') {
        return next({ name: 'Dashboard' })
      } else {
        return next()
      }
    } else {
      if (to.meta.public) {
        return next()
      }
      return next({ name: 'Login', query: { redirect: to.path, ...to.query } })
    }
  }
}
