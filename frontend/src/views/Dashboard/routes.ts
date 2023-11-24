import type { Route } from '@/router'

const routesDashboard: Route[] = [
  {
    name: 'Dashboard',
    path: '/dashboard',
    component: import('./DashboardView.vue'),
  },
]

export default routesDashboard
