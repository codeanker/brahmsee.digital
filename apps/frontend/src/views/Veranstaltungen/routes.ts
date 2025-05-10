import type { Route } from '@/router'

const routesVeranstaltungen: Route[] = [
  {
    name: 'Veranstaltungen',
    path: 'veranstaltung/:veranstaltungId',
    redirect: { name: 'VeranstaltungDashboard' },
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltungen',
        },
      ],
    },
    children: [
      {
        name: 'VeranstaltungDashboard',
        path: 'dashboard',
        component: () => import('./DashboardView.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Dashboard',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungLageplan',
        path: 'lageplan',
        component: () => import('./LageplanView.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Lageplan',
            },
          ],
        },
      },
    ],
  },
]

export default routesVeranstaltungen
