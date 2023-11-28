import type { Route } from '../../router'

const routesAuth: Route[] = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    redirect: { name: 'Login' },
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('./Login.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
]

export default routesAuth
