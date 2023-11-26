import type { Route } from '@/router'

const veranstaltungRoutes: Route[] = [
  {
    name: 'Veranstaltungen',
    path: 'veranstaltung',
    redirect: { name: 'Alle Veranstaltungen' },
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltungen',
        },
      ],
    },
    children: [
      {
        name: 'Alle Veranstaltungen',
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
        name: 'Veranstaltung erstellen',
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
        name: 'Veranstaltgungsdetails',
        path: ':veranstaltungId',
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
