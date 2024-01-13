import type { Route } from '@/router'

const routesRegistrierung: Route[] = [
  {
    name: 'RegistrierungWrapper',
    path: '/registrierung',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        name: 'Registrierung',
        path: '',
        component: () => import('./Registrierung.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'CrewRegistrierung',
        path: 'crew',
        component: () => import('./CrewRegistrierung.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'GliederungRegistrierung',
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
