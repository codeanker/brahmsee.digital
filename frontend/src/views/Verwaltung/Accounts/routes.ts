import type { Route } from '@/router'

const routesAccount: Route[] = [
  {
    name: 'Verwaltung Accounts',
    path: 'accounts',
    redirect: { name: 'Verwaltung Alle Accounts' },
    meta: {
      breadcrumbs: [
        {
          text: 'Accounts',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle Accounts',
        path: 'list',
        component: () => import('./AccountList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Account erstellen',
        path: 'create',
        component: () => import('./AccountCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Details',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Accountdetails',
        path: ':accountId/detail',
        component: () => import('./AccountDetail.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Details',
            },
          ],
        },
      },
    ],
  },
]

export default routesAccount
