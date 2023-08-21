import useAuthentication from '@/composables/useAuthentication'
import { Route } from '@/types'
import { NavigationGuardWithThis } from 'vue-router'

export default function makeGuard(routes: Route[]): NavigationGuardWithThis<undefined> {
  const publicRoutes: string[] = routes
    .flatMap((route) => (route.children === undefined ? route : (route.children as Route[])))
    .filter((route) => route.public)
    .map((route) => route.name as string)

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
      if (publicRoutes.includes(to.name as string)) {
        next()
      }
      return next({ name: 'Login', query: { redirect: to.path, ...to.query } })
    }
  }
}
