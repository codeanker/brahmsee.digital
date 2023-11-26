import type { Route } from '@/router'

const gliederungRoutes: Route[] = [
  {
    name: 'Gliederungen',
    path: 'gliederungen',
    redirect: { name: 'Alle Gliederungen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Benutzer',
        },
      ],
    },
    children: [
      {
        name: 'Alle Gliederungen',
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
        name: 'Gliederung erstellen',
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
        name: 'Gliederungsdetails',
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
        name: 'Gliederung Account anfragen',
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
