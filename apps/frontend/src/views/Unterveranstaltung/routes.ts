import type { Route } from '@/router'
import type { BreadcrumbDefinition } from '@/types'

const detailCrumb: BreadcrumbDefinition = ({ params }) => ({
  text: 'Details zur Ausschreibung',
  to: {
    name: 'UnterveranstaltungDetail',
    params,
  },
})

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
            detailCrumb,
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
          breadcrumbs: [detailCrumb],
        },
      },
      {
        name: 'Unterveranstaltung Custom Field erstellen',
        path: ':unterveranstaltungId/fields/create',
        component: () => import('./CustomFields/CustomFieldUnterveranstaltungCreate.vue'),
        meta: {
          breadcrumbs: [
            detailCrumb,
            {
              text: 'Benutzerdefiniertes Feld erstellen',
            },
          ],
        },
      },
      {
        name: 'Unterveranstaltung Custom Field bearbeiten',
        path: ':unterveranstaltungId/fields/:fieldId',
        component: () => import('./CustomFields/CustomFieldUnterveranstaltungEdit.vue'),
        meta: {
          breadcrumbs: [
            detailCrumb,
            {
              text: 'Benutzerdefiniertes Feld bearbeiten',
            },
          ],
        },
      },
    ],
  },
]
