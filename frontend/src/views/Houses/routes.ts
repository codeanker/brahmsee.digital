import _import from '@/helpers/import'
import { Route } from '@/types'

const routesHouses: Route[] = [
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
]

export default routesHouses
