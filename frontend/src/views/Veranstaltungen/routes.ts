import type { Route } from '@/router'

const routesVeranstaltungen: Route[] = [
  {
    name: 'DashboardView',
    path: '/veranstaltung/:id/dashboard',
    component: () => import('./DashboardView.vue'),
  },

  {
    name: 'AuswertungenView',
    path: '/veranstaltung/:id/auswertung',
    component: () => import('./Auswertung/AuswertungView.vue'),
  },
  {
    name: 'AuswertungVerpflegungView',
    path: '/veranstaltung/:id/auswertung/verpflegung',
    component: () => import('./Auswertung/VerpflegungView.vue'),
  },
  {
    name: 'AuswertungenAnmeldungenView',
    path: '/veranstaltung/:id/auswertung/anmeldungen',
    component: () => import('./Auswertung/AnmeldungenView.vue'),
  },

  {
    name: 'AnmeldungenView',
    path: '/veranstaltung/:id/anmeldungen',
    component: () => import('./Anmeldungen/AnmeldungenView.vue'),
  },
  {
    name: 'AnmeldungenCrewView',
    path: '/veranstaltung/:id/anmeldungen/crew',
    component: () => import('./Anmeldungen/CrewView.vue'),
  },
  {
    name: 'AnmeldungenGliederungView',
    path: '/veranstaltung/:id/anmeldungen/gliederungen',
    component: () => import('./Anmeldungen/Gliederung/GliederungView.vue'),
  },
  {
    name: 'AnmeldungenGliederungTeilnehmendeView',
    path: '/veranstaltung/:id/anmeldungen/gliederungen/:gliederungId/teilnehmende',
    component: () => import('./Anmeldungen/Gliederung/TeilnehmendeView.vue'),
  },

  {
    name: 'ProgrammListeView',
    path: '/veranstaltung/:id/programm',
    component: () => import('./Programm/ListeView.vue'),
  },
  {
    name: 'ProgrammDetailView',
    path: '/veranstaltung/:id/programm/:programmId',
    component: () => import('./Programm/DetailView.vue'),
  },
  {
    name: 'ProgrammErstellenView',
    path: '/veranstaltung/:id/programm/erstellen',
    component: () => import('./Programm/ErstellenView.vue'),
  },
  {
    name: 'LageplanView',
    path: '/veranstaltung/:id/lageplan',
    component: () => import('./LageplanView.vue'),
  },
]

export default routesVeranstaltungen
