import type { Route } from '@/router'

const gliederungRoutes: Route[] = [
  {
    name: 'Verwaltung Gliederungen',
    path: 'gliederungen',
    redirect: { name: 'Verwaltung Alle Gliederungen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Gliederungen',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Gliederungen',
        path: 'liste',
        component: () => import('./GliederungList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Gliederung Erstellen',
        path: 'erstellen',
        component: () => import('./GliederungCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Erstellen',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Gliederungsdetails',
        path: ':gliederungId',
        component: () => import('./GliederungDetail.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Gliederung',
            },
          ],
        },
      },
    ],
  },
]

export default gliederungRoutes
