export default [
  {
    name: 'RegistrationStart',
    path: '/registration',
    component: () => import('./RegistrationStart.vue'),
  },
  {
    name: 'RegisterLogin',
    path: '/registration/registerLogin',
    component: () => import('./RegisterLogin.vue'),
  },
  {
    name: 'RegisterUsername',
    path: '/registration/registerUsername',
    component: () => import('./RegisterUsername.vue'),
  },
]
