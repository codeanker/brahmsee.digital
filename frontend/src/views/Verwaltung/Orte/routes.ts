import type { Route } from '@/router'

const orteRoutes: Route[] = [
  {
    name: 'Orte',
    path: 'orte',
    redirect: { name: 'Alle Orte' },
    meta: {
      breadcrumbs: [
        {
          text: 'Orte',
        },
      ],
    },
    children: [
      {
        name: 'Alle Orte',
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
        name: 'Ort erstellen',
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
        name: 'Ortdetails',
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
