export default [
  {
    name: 'Houses',
    path: '/houses',
    component: () => import('./HousesList.vue'),
  },
  {
    name: 'HousesDetail',
    path: '/houses/:houseId/detail',
    component: () => import('./HouseDetail.vue'),
  },
]
