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
        name: 'VerwaltungVeranstaltungEdit',
        path: ':veranstaltungId/edit',
        component: () => import('./VeranstaltungEdit.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Veranstaltung bearbeiten',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Veranstaltungsdetails',
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
      {
        name: 'Verwaltung Custom Field erstellen',
        path: ':veranstaltungId/fields/create',
        component: () => import('../../CustomFields/CustomFieldCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Benutzerdefiniertes Feld erstellen',
            },
          ],
        },
      },
    ],
  },
]

export default veranstaltungRoutes
