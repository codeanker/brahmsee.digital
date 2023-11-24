import type { Route } from '../../router'

const routesRegistration: Route[] = [
  {
    name: 'RegistrationStart',
    path: '/registration',
    component: import('./RegistrationStart.vue'),
    meta: {
      public: true,
    },
  },
  {
    name: 'RegisterLogin',
    path: '/registration/registerLogin',
    component: import('./RegisterLogin.vue'),
    meta: {
      public: true,
    },
  },
  {
    name: 'RegisterUsername',
    path: '/registration/registerUsername',
    component: import('./RegisterUsername.vue'),
    meta: {
      public: true,
    },
  },
]

export default routesRegistration
