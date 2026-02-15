import type { Route } from '@/router'

const routesAccess: Route[] = [
  {
    path: '/access',
    redirect: { name: 'Verwaltung Alle Zugriffsanfragen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Zugriff',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Zugriffsanfragen',
        path: 'requests',
        component: () => import('./GliederungAccessRequests.vue'),
      },
    ],
  },
]

export default routesAccess
