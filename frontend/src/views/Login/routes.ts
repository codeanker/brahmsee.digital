import type { Route } from '../../router'

const routesAuth: Route[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('./Login.vue'),
    meta: {
      public: true,
    },
  },
]

export default routesAuth
