import _import from '@/helpers/import'
import type { Route } from '@/types'

const routesUser: Route[] = [
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
]

export default routesUser
