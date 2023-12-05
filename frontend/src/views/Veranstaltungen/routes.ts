import anmeldungenRoutes from './Anmeldungen/routes'
import { routesVeranstaltungAusschreibung } from './Ausschreibung/routes'
import auswertungRoutes from './Auswertung/routes'
import programmRoutes from './Programm/routes'

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
      ...anmeldungenRoutes,
      ...auswertungRoutes,
      ...programmRoutes,
      ...routesVeranstaltungAusschreibung,
    ],
  },
]

export default routesVeranstaltungen
