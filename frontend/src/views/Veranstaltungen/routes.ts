import type { Route } from '@/router'

const routesUser: Route[] = [
  {
    name: 'DashboardView',
    path: '/veranstaltung/:veranstalungId/dashboard',
    component: () => import('./DashboardView.vue'),
  },
  // Auswertungen
  {
    name: 'AuswertungenView',
    path: '/veranstaltung/:veranstalungId/auswertung',
    component: () => import('./Auswertung/AuswertungView.vue'),
  },
  {
    name: 'AuswertungVerpflegungView',
    path: '/veranstaltung/:veranstalungId/auswertung/verpflegung',
    component: () => import('./Auswertung/VerpflegungView.vue'),
  },
  {
    name: 'AuswertungenAnmeldungenView',
    path: '/veranstaltung/:veranstalungId/auswertung/anmeldungen',
    component: () => import('./Auswertung/AnmeldungenView.vue'),
  },
  // Anmeldungen
  {
    name: 'AnmeldungenView',
    path: '/veranstaltung/:veranstalungId/anmeldungen',
    component: () => import('./Anmeldungen/AnmeldungenView.vue'),
  },
  {
    name: 'AnmeldungenCrewView',
    path: '/veranstaltung/:veranstalungId/anmeldungen/crew',
    component: () => import('./Anmeldungen/CrewView.vue'),
  },
  {
    name: 'AnmeldungenGliederungView',
    path: '/veranstaltung/:veranstalungId/anmeldungen/gliederungen',
    component: () => import('./Anmeldungen/Gliederung/GliederungView.vue'),
  },
  {
    name: 'AnmeldungenGliederungTeilnehmendeView',
    path: '/veranstaltung/:veranstalungId/anmeldungen/gliederungen/:gliederungId/teilnehmende',
    component: () => import('./Anmeldungen/Gliederung/TeilnehmendeView.vue'),
  },
  // Programm
  {
    name: 'ProgrammListeView',
    path: '/veranstaltung/:veranstalungId/programm',
    component: () => import('./Programm/ListeView.vue'),
  },
  {
    name: 'ProgrammDetailView',
    path: '/veranstaltung/:veranstalungId/programm/:programmId',
    component: () => import('./Programm/DetailView.vue'),
  },
  {
    name: 'ProgrammErstellenView',
    path: '/veranstaltung/:veranstalungId/programm/erstellen',
    component: () => import('./Programm/ErstellenView.vue'),
  },
  {
    name: 'LageplanView',
    path: '/veranstaltung/:veranstalungId/lageplan',
    component: () => import('./LageplanView.vue'),
  },
]

export default routesUser
