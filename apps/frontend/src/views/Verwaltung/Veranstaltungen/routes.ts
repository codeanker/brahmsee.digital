import type { Route } from '@/router'
import type { BreadcrumbDefinition } from '@/types'

const detailCrumb: BreadcrumbDefinition = ({ params }) => ({
  text: 'Details zur Veranstaltung',
  to: {
    name: 'Verwaltung Veranstaltungsdetails',
    params,
  },
})

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
            detailCrumb,
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
          breadcrumbs: [detailCrumb],
        },
      },
      {
        name: 'Verwaltung Custom Field erstellen',
        path: ':veranstaltungId/fields/create',
        component: () => import('./CustomFields/CustomFieldVeranstaltungCreate.vue'),
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
        name: 'Verwaltung Custom Field bearbeiten',
        path: ':veranstaltungId/fields/:fieldId',
        component: () => import('./CustomFields/CustomFieldVeranstaltungEdit.vue'),
        meta: {
          breadcrumbs: [
            detailCrumb,
            {
              text: 'Benutzerdefiniertes Feld bearbeiten',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Programmpunkt erstellen',
        path: ':veranstaltungId/program/create',
        component: () => import('../Program/ProgramForm.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Programmpunkt anlegen',
            },
          ],
        },
      },
      {
        name: 'Verwaltung Programmpunkt bearbeiten',
        path: ':veranstaltungId/program/:programId/edit',
        component: () => import('../Program/ProgramForm.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Programmpunkt bearbeiten',
            },
          ],
        },
      },
    ],
  },
]

export default veranstaltungRoutes
