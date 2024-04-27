import type { Route } from '@/router'

const fileRoutes: Route[] = [
  {
    name: 'Verwaltung File',
    path: 'file',
    redirect: { name: 'Verwaltung Alle File' },
    meta: {
      breadcrumbs: [
        {
          text: 'File',
        },
      ],
    },
    children: [
      {
        name: 'Verwaltung Alle File',
        path: 'liste',
        component: () => import('./FileList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
    ],
  },
]

export default fileRoutes
