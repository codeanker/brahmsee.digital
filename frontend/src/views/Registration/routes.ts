import _import from '@/helpers/import'
import { Route } from '@/types'

const routesRegistration: Route[] = [
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
]

export default routesRegistration
