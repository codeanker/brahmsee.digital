import type { Route } from '@/router'

const routesPerson: Route[] = [
  {
    name: 'Verwaltung Personen',
    path: 'persons',
    redirect: { name: 'Verwaltung Alle Personen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Personen',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Personen',
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
        name: 'Verwaltung Person erstellen',
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
        name: 'Verwaltung Persondetails',
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
