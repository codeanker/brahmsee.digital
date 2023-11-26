import userRoutes from './Benutzer/routes'
import gliederungRoutes from './Gliederungen/routes'
import orteRoutes from './Orte/routes'
import veranstaltungRoutes from './Veranstaltungen/routes'

import type { Route } from '@/router'

const routesVerwaltung: Route[] = [
  {
    name: 'Verwaltung',
    path: '/verwaltung',
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
      ],
    },
    children: [...userRoutes, ...gliederungRoutes, ...orteRoutes, ...veranstaltungRoutes],
  },
]

export default routesVerwaltung
