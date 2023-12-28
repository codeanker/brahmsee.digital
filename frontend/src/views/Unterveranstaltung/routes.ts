import type { Route } from '@/router'

export const routesUnterveranstaltung: Route[] = [
  {
    name: 'Auschreibungen',
    path: 'unterveranstaltung',
    redirect: { name: 'UnterveranstaltungList' },
    meta: {
      breadcrumbs: [
        {
          text: 'Ausschreibungen',
        },
      ],
    },
    children: [
      {
        name: 'UnterveranstaltungList',
        path: 'list',
        component: () => import('./UnterveranstaltungList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Liste',
            },
          ],
        },
      },
      {
        name: 'UnterveranstaltungCreate',
        path: 'create/:veranstaltungId?',
        component: () => import('./UnterveranstaltungCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Neue Ausschreibung',
            },
          ],
        },
      },
      {
        name: 'UnterveranstaltungEdit',
        path: ':unterveranstaltungId/edit',
        component: () => import('./UnterveranstaltungEdit.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Ausschreibung bearbeiten',
            },
          ],
        },
      },
      {
        name: 'UnterveranstaltungDetail',
        path: ':unterveranstaltungId',
        component: () => import('./UnterveranstaltungDetail.vue'),
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
