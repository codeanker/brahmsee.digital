import type { Route } from '@/router'

const routesConfirm: Route[] = [
  {
    path: '/confirm',
    component: () => import('@/layouts/PublicLayout.vue'),
    redirect: { name: 'ConfirmGliederungAccess' },
    children: [
      {
        name: 'ConfirmGliederungAccess',
        path: 'gliederung-access/:token',
        component: () => import('./GliederungAccess.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
]

export default routesConfirm
