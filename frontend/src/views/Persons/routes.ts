import type { Route } from '../../router'

const routesPerson: Route[] = [
  {
    name: 'Persons',
    path: '/persons',
    component: () => import('./PersonList.vue'),
  },
  {
    name: 'PersonCreate',
    path: '/persons/create',
    component: () => import('./PersonCreate.vue'),
  },
  {
    name: 'PersonDetail',
    path: '/persons/:userId/detail',
    component: () => import('./PersonDetail.vue'),
  },
]

export default routesPerson
