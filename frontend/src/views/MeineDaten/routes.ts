import type { Route } from '@/router'

const routesMeineDaten: Route[] = [
  {
    name: 'Meine Daten',
    path: '/my',
    meta: {
      breadcrumbs: [
        {
          text: 'Personen',
        },
      ],
    },
    children: [
      {
        name: 'Meine Personen',
        path: 'persons',
        component: () => import('./MeinePersonen.vue'),
      },
      {
        name: 'Meine Anmeldungen',
        path: 'anmeldungen',
        component: () => import('./MeineAnmeldungen.vue'),
      },
    ],
  },
]

export default routesMeineDaten
