import type { Route } from '@/router'

const anmeldungenRoutes: Route[] = [
  {
    name: 'VeranstaltungAnmeldung',
    path: 'anmeldungen',
    redirect: { name: 'VeranstaltungAnmeldungenÜbersicht' },
    meta: {
      breadcrumbs: [
        {
          text: 'Anmeldung',
        },
      ],
    },
    children: [
      {
        name: 'VeranstaltungAnmeldungenÜbersicht',
        path: 'overview',
        component: () => import('./AnmeldungenÜbersicht.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Übersicht',
            },
          ],
          title: 'Anmeldung',
        },
      },
      {
        name: 'VeranstaltungAnmeldungenTeilnehmende',
        path: 'teilnehmende',
        component: () => import('./AnmeldungenTeilnehmende.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Teilnehmende',
            },
          ],
          title: 'Teilnehmende',
        },
      },
      {
        name: 'VeranstaltungAnmeldungenCrew',
        path: 'crew',
        component: () => import('./AnmeldungenCrew.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Crew',
            },
          ],
          title: 'Anmeldung',
        },
      },
      {
        name: 'VeranstaltungAnmeldungenGliederungen',
        path: 'gliederungen',
        component: () => import('./AnmeldungenGliederung.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Gliederungen',
            },
          ],
          title: 'Anmeldung',
        },
      },
      {
        name: 'VeranstaltungAnmeldungenCreate',
        path: 'create',
        component: () => import('./AnmeldungenCreate.vue'),
        meta: {
          breadcrumbs: [
            {
              text: 'Anmeldung erstellen',
            },
          ],
          title: 'Anmeldung erstellen',
        },
      },
    ],
  },
]

export default anmeldungenRoutes
