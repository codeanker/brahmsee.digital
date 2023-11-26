import type { Route } from '@/router'

const userRoutes: Route[] = [
  {
    name: 'Benutzer',
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
        name: 'Alle Benutzer',
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
        name: 'Benutzer erstellen',
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
        name: 'Benutzerdetails',
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
