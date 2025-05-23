import type { Route } from '@/router'

export const routesPublic: Route[] = [
  {
    name: 'Public',
    path: '/public',
    meta: {
      public: true,
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
          public: true,
          breadcrumbs: [
            {
              text: 'Datenschutz',
            },
          ],
        },
      },
      {
        name: 'Impressum',
        path: 'impressum',
        component: () => import('./Impressum.vue'),
        meta: {
          public: true,
          breadcrumbs: [
            {
              text: 'Impressum',
            },
          ],
        },
      },
    ],
  },
]
