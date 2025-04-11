import type { Route } from '@/router'

const auswertungRoutes: Route[] = [
  {
    name: 'VeranstaltungAuswertung',
    path: 'auswertung',
    redirect: { name: 'VeranstaltungAuswertungVeranstaltung' },
    meta: {
      breadcrumbs: [
        {
          text: 'Auswertung',
        },
      ],
    },
    children: [
      {
        name: 'VeranstaltungAuswertungVeranstaltung',
        path: '',
        component: () => import('./AuswertungVeranstaltung.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Veranstaltung',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungAuswertungVerpflegung',
        path: 'verpflegung',
        component: () => import('./AuswertungVerpflegung.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Verpflegung',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungAuswertungenAnmeldungen',
        path: 'anmeldungen',
        component: () => import('./AuswertungAnmeldungen.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Anmeldungen',
            },
          ],
        },
      },
    ],
  },
]

export default auswertungRoutes
