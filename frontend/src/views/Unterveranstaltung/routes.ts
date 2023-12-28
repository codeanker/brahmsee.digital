import type { Route } from '@/router'

export const routesVeranstaltungUnterveranstaltung: Route[] = [
  {
    name: 'VeranstaltungAuschreibungen',
    path: 'unterveranstaltung',
    redirect: { name: 'VeranstaltungUnterveranstaltungList' },
    meta: {
      breadcrumbs: [
        {
          text: 'Ausschreibungen',
        },
      ],
    },
    children: [
      {
        name: 'VeranstaltungUnterveranstaltungList',
        path: 'list',
        component: () => import('./VeranstaltungUnterveranstaltungList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Liste',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungUnterveranstaltungCreate',
        path: 'create/:veranstaltungId?',
        component: () => import('./VeranstaltungUnterveranstaltungCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Neue Ausschreibung',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungUnterveranstaltungEdit',
        path: ':unterveranstaltungId/edit',
        component: () => import('./VeranstaltungUnterveranstaltungEdit.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Ausschreibung bearbeiten',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungUnterveranstaltungDetail',
        path: ':unterveranstaltungId',
        component: () => import('./VeranstaltungUnterveranstaltungDetail.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Ausschreibung',
            },
          ],
        },
      },
    ],
  },
]
