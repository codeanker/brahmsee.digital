import type { Route } from '../../router'

const routesAuth: Route[] = [
  {
    name: 'Login',
    path: '/login',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('./Login.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
]

export default routesAuth
