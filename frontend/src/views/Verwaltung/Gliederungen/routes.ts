import type { Route } from '@/router'

const gliederungRoutes: Route[] = [
  {
    name: 'Verwaltung Gliederungen',
    path: 'gliederungen',
    redirect: { name: 'Verwaltung Alle Gliederungen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Benutzer',
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
        name: 'Verwaltung Gliederung erstellen',
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
      {
        name: 'Verwaltung Gliederung Account anfragen',
        path: 'anfrage',
        component: () => import('./GliederungAccountanfrage.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Anfragen',
            },
          ],
        },
      },
    ],
  },
]

export default gliederungRoutes
