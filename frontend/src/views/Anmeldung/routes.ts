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
        name: 'Public Anmeldung E-Mail Bestätigung',
        path: '/ausschreibung/:ausschreibungId/anmeldung/verify',
        component: () => import('../Anmeldung/PublicAnmeldungEmailVerification.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
          useFullheight: true,
        },
      },
      {
        name: 'Public Anmeldung E-Mail Bestätigung Confirm',
        path: '/ausschreibung/confirm/:activationTokenAccount/:activationTokenAnmeldung',
        component: () => import('./PublicAnmeldungMailConfirm.vue'),
        meta: {
          public: true,
        },
      },
      {
        name: 'Public Anmeldung Result',
        path: '/ausschreibung/:ausschreibungId/anmeldung/result',
        component: () => import('../Anmeldung/PublicAnmeldungResultView.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
          useFullheight: true,
        },
      },
      {
        name: 'Public Anmeldung Portal',
        path: '/ausschreibung/:ausschreibungId/anmeldung/portal',
        component: () => import('../Anmeldung/PublicAnmeldungOverview.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
          hidePublicHeaderBg: true,
          useFullheight: true,
        },
      },
      {
        name: 'Public Anmeldung Portal Detail',
        path: '/ausschreibung/:ausschreibungId/anmeldung/portal/:anmeldungId',
        component: () => import('../Anmeldung/PublicAnmeldungDetail.vue'),
        meta: {
          public: true,
          hidePublicHeaderBgOnMobile: true,
          hidePublicHeaderBg: true,
          useFullheight: true,
        },
      },
    ],
  },
]

export default routesAusschreibungen
