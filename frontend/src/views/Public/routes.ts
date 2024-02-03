import type { Route } from '@/router'

export const routesPublic: Route[] = [
  {
    name: 'Public',
    path: '/public',
    meta: {
      breadcrumbs: [
        {
          text: 'Public',
        },
      ],
    },
    children: [
      {
        name: 'Datenschutz',
        path: 'datenschutz',
        component: () => import('./Datenschutz.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Datenschutz',
            },
          ],
        },
      },
    ],
  },
]
