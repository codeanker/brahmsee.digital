import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import authenticationGuard from './authenticationGuard'

import routesDevelopment from '@/views/Development/routes'
import routesAuth from '@/views/Login/routes'
import routesPublicAnmeldung from '@/views/PublicAnmeldung/routes'
import routesRegistrierung from '@/views/Registrierung/routes'
import { routesUnterveranstaltung } from '@/views/Unterveranstaltung/routes'
import routesVeranstaltungen from '@/views/Veranstaltungen/routes'
import routesVerwaltung from '@/views/Verwaltung/routes'

export type Route = RouteRecordRaw & {
  meta?: {
    public?: boolean
  }
}

const routes: Route[] = [
  ...routesAuth,
  ...routesPublicAnmeldung,
  ...routesRegistrierung,
  {
    path: '/',
    redirect: { name: 'Login' },
    component: () => import('../layouts/BaseLayout.vue'),
    children: [
      ...routesVeranstaltungen,
      ...routesVerwaltung,
      ...routesDevelopment,
      ...routesUnterveranstaltung,
      {
        name: 'Dashboard',
        path: '/dashboard',
        component: () => import('../views/Dashboard/Dashboard.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Dashboard',
            },
          ],
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authenticationGuard())

export default router
