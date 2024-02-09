import type { Route } from '@/router'

const routesAusschreibungen: Route[] = [
  {
    name: 'Ausschreibung',
    path: '/ausschreibung',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      {
        name: 'Public Ausschreibung',
        path: '/ausschreibung/:ausschreibungId',
        component: () => import('./PublicAusschreibungView.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'Public Anmeldung',
        path: '/ausschreibung/:ausschreibungId/anmeldung',
        component: () => import('./PublicAnmeldungView.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
        },
      },
      {
        name: 'Public Anmeldung Result',
        path: '/ausschreibung/:ausschreibungId/anmeldung/result',
        component: () => import('./PublicAnmeldungResultView.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
          useFullheight: true,
        },
      },
    ],
  },
]

export default routesAusschreibungen
