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
      {
        name: 'Email bestätigen',
        path: 'confirm/:activationToken',
        component: () => import('./EmailBestaetigen.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
]

export default routesRegistrierung
