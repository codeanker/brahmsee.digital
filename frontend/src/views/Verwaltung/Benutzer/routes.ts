import type { Route } from '@/router'

const userRoutes: Route[] = [
  {
    name: 'Verwaltung Benutzer',
    path: 'benutzer',
    redirect: { name: 'Alle Benutzer' },
    meta: {
      breadcrumbs: [
        {
          text: 'Benutzer',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Benutzer',
        path: 'liste',
        component: () => import('./BenutzerList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Benutzer erstellen',
        path: 'erstellen',
        component: () => import('./BenutzerCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Erstellen',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Benutzerdetails',
        path: ':benutzerId',
        component: () => import('./BenutzerDetail.vue'),
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

export default userRoutes
