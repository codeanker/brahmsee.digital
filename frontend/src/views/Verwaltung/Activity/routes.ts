import type { Route } from '@/router'

const routesActivity: Route[] = [
  {
    name: 'Verwaltung Aktivitäten',
    path: 'activity',
    redirect: { name: 'Verwaltung Alle Aktivitäten' },
    meta: {
      breadcrumbs: [
        {
          text: 'Aktivitäten',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Aktivitäten',
        path: 'list',
        component: () => import('./ActivityList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
    ],
  },
]

export default routesActivity
