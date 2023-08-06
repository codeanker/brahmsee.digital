import { Route } from '@/types'
import _import from '@/helpers/import'

const routesAuth: Route[] = [
  {
    name: 'Login',
    path: '/login',
    component: _import('../views/Login/Login.vue'),
    public: true,
  },
]

export default routesAuth
