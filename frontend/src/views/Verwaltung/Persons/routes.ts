import type { Route } from '@/router'

const routesPerson: Route[] = [
  {
    name: 'Verwaltung Personen',
    path: 'persons',
    redirect: { name: 'Verwaltung Alle Benutzer' },
    meta: {
      breadcrumbs: [
        {
          text: 'Personen',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Benutzer',
        path: 'list',
        component: () => import('./PersonList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Benutzer erstellen',
        path: 'create',
        component: () => import('./PersonCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Erstellen',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Benutzerdetails',
        path: ':personId/detail',
        component: () => import('./PersonDetail.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Detail',
            },
          ],
        },
      },
    ],
  },
]

export default routesPerson
