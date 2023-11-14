import _import from '@/helpers/import'
import type { Route } from '@/types'

const routesDashboard: Route[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: _import('../views/Dashboard/DashboardView.vue'),
  },
]

export default routesDashboard
