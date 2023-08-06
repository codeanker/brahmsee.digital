import _import from '@/helpers/import'
import { Route } from '@/types'
import routesDashboard from '@/views/Dashboard/routes'
import routesHouses from '@/views/Houses/routes'
import routesAuth from '@/views/Login/routes'
import routesRegistration from '@/views/Registration/routes'
import routesUser from '@/views/Users/routes'
import { createRouter, createWebHistory } from 'vue-router'
import authenticationGuard from './authenticationGuard'

const routes: Route[] = [
  {
    name: 'Developer',
    path: '/developer',
    component: _import('../views/Developer.vue'),
  },

  ...routesAuth,
  ...routesRegistration,

  {
    path: '/',
    component: _import('../layouts/BaseLayout.vue'),
    children: [...routesDashboard, ...routesUser, ...routesHouses],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authenticationGuard(routes))

export default router
