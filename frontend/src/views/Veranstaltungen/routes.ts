import type { Route } from '@/router'

const routesVeranstaltungen: Route[] = [
  {
    name: 'DashboardView',
    path: '/veranstaltung/:veranstaltungId/dashboard',
    component: () => import('./DashboardView.vue'),
  },

  {
    name: 'AuswertungenView',
    path: '/veranstaltung/:veranstaltungId/auswertung',
    component: () => import('./Auswertung/AuswertungView.vue'),
  },
  {
    name: 'AuswertungVerpflegungView',
    path: '/veranstaltung/:veranstaltungId/auswertung/verpflegung',
    component: () => import('./Auswertung/VerpflegungView.vue'),
  },
  {
    name: 'AuswertungenAnmeldungenView',
    path: '/veranstaltung/:veranstaltungId/auswertung/anmeldungen',
    component: () => import('./Auswertung/AnmeldungenView.vue'),
  },

  {
    name: 'AnmeldungenView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen',
    component: () => import('./Anmeldungen/AnmeldungenView.vue'),
  },
  {
    name: 'AnmeldungenCrewView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen/crew',
    component: () => import('./Anmeldungen/CrewView.vue'),
  },
  {
    name: 'AnmeldungenGliederungView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen/gliederungen',
    component: () => import('./Anmeldungen/GliederungView.vue'),
  },
  {
    name: 'AnmeldungenGliederungTeilnehmendeView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen/teilnehmende',
    component: () => import('./Anmeldungen/TeilnehmendeView.vue'),
  },

  {
    name: 'ProgrammListeView',
    path: '/veranstaltung/:veranstaltungId/programm',
    component: () => import('./Programm/ListeView.vue'),
  },
  {
    name: 'ProgrammDetailView',
    path: '/veranstaltung/:veranstaltungId/programm/:programmId',
    component: () => import('./Programm/DetailView.vue'),
  },
  {
    name: 'ProgrammErstellenView',
    path: '/veranstaltung/:veranstaltungId/programm/erstellen',
    component: () => import('./Programm/ErstellenView.vue'),
  },
  {
    name: 'LageplanView',
    path: '/veranstaltung/:veranstaltungId/lageplan',
    component: () => import('./LageplanView.vue'),
  },
]

export default routesVeranstaltungen
