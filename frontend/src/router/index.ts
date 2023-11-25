import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import authenticationGuard from './authenticationGuard'

import routesDevelopment from '@/views/Development/routes'
import routesAuth from '@/views/Login/routes'
import routesPerson from '@/views/Persons/routes'
import routesVeranstaltungen from '@/views/Veranstaltungen/routes'
import routesVerwaltung from '@/views/Verwaltung/routes'

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
    children: [...routesPerson, ...routesVeranstaltungen, ...routesVerwaltung, ...routesDevelopment],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authenticationGuard())

export default router
