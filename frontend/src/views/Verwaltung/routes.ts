import gliederungRoutes from './Gliederungen/routes'
import orteRoutes from './Orte/routes'
import routesPerson from './Persons/routes'
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
    children: [...gliederungRoutes, ...orteRoutes, ...routesPerson, ...veranstaltungRoutes, ...orteRoutes],
  },
]

export default routesVerwaltung
