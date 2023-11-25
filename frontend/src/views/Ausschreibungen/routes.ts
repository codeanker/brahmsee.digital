import type { Route } from '@/router'

const routesAusschreibungen: Route[] = [
  {
    name: 'Ausschreibung',
    path: '/ausschreibung',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        name: 'Ausschreibung',
        path: '/ausschreibung/:ausschreibungId',
        component: () => import('@/views/Ausschreibungen/AusschreibungView.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'Anmeldung',
        path: '/ausschreibung/:ausschreibungId/anmeldung',
        component: () => import('@/views/Ausschreibungen/AnmeldungView.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
        },
      },
    ],
  },
]

export default routesAusschreibungen
