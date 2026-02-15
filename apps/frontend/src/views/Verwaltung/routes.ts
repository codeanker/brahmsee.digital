import routesMeineDaten from '../MeineDaten/routes'
import routesAccess from './AccessControl/routes'
import routesAccount from './Accounts/routes'
import gliederungRoutes from './Gliederungen/routes'
import orteRoutes from './Orte/routes'
import routesPerson from './Persons/routes'
import veranstaltungRoutes from './Veranstaltungen/routes'

import type { Route } from '@/router'

const routesVerwaltung: Route[] = [
  {
    name: 'Verwaltung',
    path: '/verwaltung',
    children: [
      ...gliederungRoutes,
      ...orteRoutes,
      ...routesPerson,
      ...veranstaltungRoutes,
      ...orteRoutes,
      ...routesAccount,
      ...routesMeineDaten,
      ...routesAccess,
    ],
  },
]

export default routesVerwaltung
