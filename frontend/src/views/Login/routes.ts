import _import from '@/helpers/import'
import type { Route } from '@/types'

const routesAuth: Route[] = [
  {
    name: 'Login',
    path: '/login',
    component: _import('../views/Login/Login.vue'),
    public: true,
  },
]

export default routesAuth
