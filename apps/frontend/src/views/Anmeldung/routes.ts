import type { Route } from '@/router'

const routesAusschreibungen: Route[] = [
  {
    name: 'Ausschreibung',
    path: '/ausschreibung/:unterveranstaltungId',
    component: () => import('@/layouts/AnmeldungLayout.vue'),
    children: [
      {
        name: 'Public Landing',
        path: '',
        component: () => import('./PublicLanding.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'Public Anmeldung',
        path: 'anmeldung',
        component: () => import('./PublicAnmeldungView.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
        },
      },
      {
        name: 'Public Anmeldung Result',
        path: 'anmeldung/result',
        component: () => import('./PublicAnmeldungResultView.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
          useFullheight: true,
        },
      },
      {
        name: 'Public Anmeldung Fotoupload',
        path: 'anmeldung/:anmeldungId/foto-upload',
        component: () => import('./FotoUpload.vue'),
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
