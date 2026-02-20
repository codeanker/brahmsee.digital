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
        component: () => import('./RegistrierungSelect.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'RegistrierungTeilnehmer',
        path: 'teilnehmer',
        component: () => import('./Registrierung.vue'),
        meta: {
          public: true,
        },
        props: {
          mode: 'teilnehmer',
        },
      },
      {
        name: 'RegistrierungGliederung',
        path: 'gliederung',
        component: () => import('./Registrierung.vue'),
        meta: {
          public: true,
        },
        props: {
          mode: 'gliederung',
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
