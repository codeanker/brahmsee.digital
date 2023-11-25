import type { Route } from '@/router'

const routesDevelopment: Route[] = [
  {
    name: 'Development',
    path: '/development',
    children: [
      {
        name: 'Komponenten',
        path: 'components',
        component: () => import('./Components.vue'),
      },
    ],
  },
]

export default routesDevelopment
