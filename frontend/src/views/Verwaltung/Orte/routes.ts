import type { Route } from '@/router'

const orteRoutes: Route[] = [
  {
    name: 'Verwaltung Orte',
    path: 'orte',
    redirect: { name: 'Verwaltung Alle Orte' },
    meta: {
      breadcrumbs: [
        {
          text: 'Orte',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Orte',
        path: 'liste',
        component: () => import('./OrtList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Ort erstellen',
        path: 'erstellen',
        component: () => import('./OrtCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Erstellen',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Ortdetails',
        path: ':ortId',
        component: () => import('./OrtDetail.vue'),
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

export default orteRoutes
