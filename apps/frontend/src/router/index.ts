import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import authenticationGuard from './authenticationGuard'

import routesPublicAnmeldung from '@/views/Anmeldung/routes'
import routesDevelopment from '@/views/Development/routes'
import routesAuth from '@/views/Login/routes'
import { routesPublic } from '@/views/Public/routes'
import routesRegistrierung from '@/views/Registrierung/routes'
import { routesUnterveranstaltung } from '@/views/Unterveranstaltung/routes'
import routesVeranstaltungen from '@/views/Veranstaltungen/routes'
import routesActivity from '@/views/Verwaltung/Activity/routes'
import routesVerwaltung from '@/views/Verwaltung/routes'
import routesAnfragen from '@/views/Anfragen/routes'
import routesConfirm from '@/views/Confirm/routes'

export type Route = RouteRecordRaw & {
  meta?: {
    public?: boolean
  }
}

const routes: Route[] = [
  ...routesAuth,
  ...routesPublic,
  ...routesPublicAnmeldung,
  ...routesRegistrierung,
  ...routesConfirm,
  {
    path: '/',
    redirect: { name: 'Login' },
    component: () => import('../layouts/BaseLayout.vue'),
    children: [
      ...routesVeranstaltungen,
      ...routesVerwaltung,
      ...routesDevelopment,
      ...routesUnterveranstaltung,
      ...routesActivity,
      ...routesAnfragen,
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
