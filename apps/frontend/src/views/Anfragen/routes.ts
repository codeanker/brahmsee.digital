import type { Route } from '@/router'

const routesAnfragen: Route[] = [
  {
    name: 'Gliederungsanfrage',
    path: '/anfrage/gliederung',
    component: () => import('./RequestGliederungAccess.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Gliederungsanfrage',
        },
      ],
    },
  },
]

export default routesAnfragen
