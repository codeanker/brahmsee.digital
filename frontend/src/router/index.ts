import { Route } from '@/types'
import { createRouter, createWebHistory } from 'vue-router'
import authenticationGuard from './authenticationGuard.js'

function _import<T>(file: string): () => Promise<T> {
  return () => import(/* @vite-ignore */ file)
}

const routes: Route[] = [
  {
    name: 'Developer',
    path: '/developer',
    component: _import('../views/Developer.vue'),
  },

  //#region Authentication
  {
    name: 'Login',
    path: '/login',
    component: _import('../views/Login/Login.vue'),
    public: true,
  },
  {
    name: 'RegistrationStart',
    path: '/registration',
    component: _import('../views/Registration/RegistrationStart.vue'),
    public: true,
  },
  {
    name: 'RegisterLogin',
    path: '/registration/registerLogin',
    component: _import('../views/Registration/RegisterLogin.vue'),
    public: true,
  },
  {
    name: 'RegisterUsername',
    path: '/registration/registerUsername',
    component: _import('../views/Registration/RegisterUsername.vue'),
    public: true,
  },
  //#endregion

  {
    path: '/',
    component: _import('../layouts/BaseLayout.vue'),
    children: [
      {
        name: 'Dashboard',
        path: '/dashboard',
        component: _import('../views/Dashboard/DashboardView.vue'),
      },

      //#region Users
      {
        name: 'Users',
        path: '/users',
        component: _import('../views/Users/UsersList.vue'),
      },
      {
        name: 'UserCreate',
        path: '/users/create',
        component: _import('../views/Users/UserCreate.vue'),
      },
      {
        name: 'UserDetail',
        path: '/users/:userId/detail',
        component: _import('../views/Users/UserDetail.vue'),
      },
      //#endregion

      //#region Houses
      {
        name: 'Houses',
        path: '/houses',
        component: _import('../views/Houses/HousesList.vue'),
      },
      {
        name: 'HousesDetail',
        path: '/houses/:houseId/detail',
        component: _import('../views/Houses/HouseDetail.vue'),
      },
      //#endregion
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(authenticationGuard(routes))

export default router
