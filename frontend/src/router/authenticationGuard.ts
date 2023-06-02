import useAuthentication from '@/composables/useAuthentication'

const publicRoutes = ['Login', 'RegistrationStart', 'RegisterLogin', 'RegisterUsername']

export default async function authenticationGuard(to, from, next) {
  const { loginPending, reAuthenticate, user } = useAuthentication()

  if (!user.value && !loginPending.value) {
    await reAuthenticate()
  }
  if (user.value) {
    if (to.name === 'Login') next({ name: 'Dashboard' })
    else next()
  } else {
    if (publicRoutes.includes(to.name)) {
      next()
    }
    return next({ name: 'Login', query: { redirect: to.path, ...to.query } })
  }
}
