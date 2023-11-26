import type { Route } from '@/router'

const routesDevelopment: Route[] = [
  {
    name: 'Development',
    path: '/development',
    meta: {
      breadcrumbs: [
        {
          text: 'Entwicklung',
        },
      ],
    },
    children: [
      {
        name: 'Komponenten',
        path: 'components',
        component: () => import('./Components.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Komponenten',
            },
          ],
        },
      },
    ],
  },
]

export default routesDevelopment
