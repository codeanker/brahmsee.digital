import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import authenticationGuard from './authenticationGuard.js'

import DashboardRoutes from '../views/Dashboard/_routes.js'
import RegistrationRoutes from '../views/Registration/_routes.js'
import LoginRoutes from '../views/Login/_routes.js'
import UsersRoutes from '../views/Users/_routes.js'
import HousesRoutes from '../views/Houses/_routes.js'

const routes = [
  {
    path: '/',
    redirect: { name: 'Dashboard' },
  },
  {
    name: 'Developer',
    path: '/developer',
    component: () => import('../views/Developer.vue'),
  },
  {
    path: '/',
    component: () => import('../layouts/BaseLayout.vue'),
    children: [...DashboardRoutes, ...RegistrationRoutes, ...UsersRoutes, ...HousesRoutes],
  },
  ...LoginRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
})

router.beforeEach(authenticationGuard)

export default router
