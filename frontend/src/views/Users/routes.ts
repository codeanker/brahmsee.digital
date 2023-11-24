import type { Route } from '../../router'

const routesUser: Route[] = [
  {
    name: 'Users',
    path: '/users',
    component: import('./UsersList.vue'),
  },
  {
    name: 'UserCreate',
    path: '/users/create',
    component: import('./UserCreate.vue'),
  },
  {
    name: 'UserDetail',
    path: '/users/:userId/detail',
    component: import('./UserDetail.vue'),
  },
]

export default routesUser
