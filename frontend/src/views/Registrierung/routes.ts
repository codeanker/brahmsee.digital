import type { Route } from '@/router'

const routesRegistrierung: Route[] = [
  {
    name: 'Registrierung',
    path: '/registrierung',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        name: 'Gliederung Registrierung',
        path: 'gliederung',
        component: () => import('./GliederungRegistrierung.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
]

export default routesRegistrierung
