import type { Route } from '@/router'

const veranstaltungRoutes: Route[] = [
  {
    name: 'Verwaltung Veranstaltungen',
    path: 'veranstaltung',
    redirect: { name: 'Verwaltung Alle Veranstaltungen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltungen',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Veranstaltungen',
        path: 'liste',
        component: () => import('./VeranstaltungList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Veranstaltung erstellen',
        path: 'erstellen',
        component: () => import('./VeranstaltungCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Erstellen',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Veranstaltungsdetails',
        path: 'detail',
        component: () => import('./VeranstaltungDetail.vue'),
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

export default veranstaltungRoutes
