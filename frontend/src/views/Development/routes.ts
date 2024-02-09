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
      {
        name: 'Mitwirkende',
        path: 'mitwirkende',
        component: () => import('./Mitwirkende.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Mitwirkende',
            },
          ],
        },
      },
    ],
  },
]

export default routesDevelopment
