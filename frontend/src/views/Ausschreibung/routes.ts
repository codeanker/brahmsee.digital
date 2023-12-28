import type { Route } from '@/router'

export const routesVeranstaltungAusschreibung: Route[] = [
  {
    name: 'VeranstaltungAuschreibungen',
    path: 'ausschreibung',
    redirect: { name: 'VeranstaltungAusschreibungList' },
    meta: {
      breadcrumbs: [
        {
          text: 'Ausschreibung',
        },
      ],
    },
    children: [
      {
        name: 'VeranstaltungAusschreibungList',
        path: 'list',
        component: () => import('./VeranstaltungAusschreibungList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Liste',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungAusschreibungCreate',
        path: 'create/:veranstaltungId?',
        component: () => import('./VeranstaltungAusschreibungCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Neue Ausschreibung',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungAusschreibungEdit',
        path: ':ausschreibungId/edit',
        component: () => import('./VeranstaltungAusschreibungEdit.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Ausschreibung bearbeiten',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungAusschreibungDetail',
        path: ':ausschreibungId',
        component: () => import('./VeranstaltungAusschreibungDetail.vue'),
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
