import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import authenticationGuard from './authenticationGuard'

import routesDashboard from '@/views/Dashboard/routes'
import routesEinstellungen from '@/views/Einstellungen/routes'
import routesAuth from '@/views/Login/routes'
import routesPerson from '@/views/Persons/routes'
import routesVeranstaltungen from '@/views/Veranstaltungen/routes'

export type Route = RouteRecordRaw & {
  meta?: {
    public?: boolean
  }
}

const routes: Route[] = [
  {
    name: 'Developer',
    path: '/developer',
    component: () => import('../views/Developer.vue'),
  },

  ...routesAuth,
  {
    path: '/',
    redirect: { name: 'Login' },
    component: () => import('../layouts/BaseLayout.vue'),
    children: [...routesDashboard, ...routesPerson, ...routesVeranstaltungen, ...routesEinstellungen],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authenticationGuard())

export default router
