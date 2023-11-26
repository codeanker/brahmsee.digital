import type { Route } from '@/router'

const programmRoutes: Route[] = [
  {
    name: 'VeranstaltungProgramm',
    path: 'programm',
    redirect: { name: 'VeranstaltungProgrammListe' },
    meta: {
      breadcrumbs: [
        {
          text: 'Programm',
        },
      ],
    },
    children: [
      {
        name: 'VeranstaltungProgrammListe',
        path: 'list',
        component: () => import('./ProgrammList.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungProgrammDetail',
        path: ':programmId',
        component: () => import('./ProgrammDetail.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Detail',
            },
          ],
        },
      },
      {
        name: 'VeranstaltungProgrammErstellen',
        path: 'erstellen',
        component: () => import('./ProgrammCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Erstellen',
            },
          ],
        },
      },
    ],
  },
]

export default programmRoutes
