import type { Route } from '@/router'

const routesVeranstaltungen: Route[] = [
  {
    name: 'DashboardView',
    path: '/veranstaltung/:veranstaltungId/dashboard',
    component: () => import('./DashboardView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Dashboard',
        },
      ],
    },
  },

  {
    name: 'AuswertungenView',
    path: '/veranstaltung/:veranstaltungId/auswertung',
    component: () => import('./Auswertung/AuswertungView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Auswertung',
        },
      ],
    },
  },
  {
    name: 'AuswertungVerpflegungView',
    path: '/veranstaltung/:veranstaltungId/auswertung/verpflegung',
    component: () => import('./Auswertung/VerpflegungView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Auswertung',
        },
        {
          text: 'Verpflegung',
        },
      ],
    },
  },
  {
    name: 'AuswertungenAnmeldungenView',
    path: '/veranstaltung/:veranstaltungId/auswertung/anmeldungen',
    component: () => import('./Auswertung/AnmeldungenView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Auswertung',
        },
        {
          text: 'Anmeldungen',
        },
      ],
    },
  },

  {
    name: 'AnmeldungenView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen',
    component: () => import('./Anmeldungen/AnmeldungenView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Anmeldungen',
        },
      ],
    },
  },
  {
    name: 'AnmeldungenCrewView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen/crew',
    component: () => import('./Anmeldungen/CrewView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Anmeldungen',
        },
        {
          text: 'Crew',
        },
      ],
    },
  },
  {
    name: 'AnmeldungenGliederungView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen/gliederungen',
    component: () => import('./Anmeldungen/GliederungView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Anmeldungen',
        },
        {
          text: 'Gliederungen',
        },
      ],
    },
  },
  {
    name: 'AnmeldungenGliederungTeilnehmendeView',
    path: '/veranstaltung/:veranstaltungId/anmeldungen/teilnehmende',
    component: () => import('./Anmeldungen/TeilnehmendeView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Anmeldungen',
        },
        {
          text: 'Teilnehmende',
        },
      ],
    },
  },

  {
    name: 'ProgrammListeView',
    path: '/veranstaltung/:veranstaltungId/programm',
    component: () => import('./Programm/ListeView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Programm',
        },
      ],
    },
  },
  {
    name: 'ProgrammDetailView',
    path: '/veranstaltung/:veranstaltungId/programm/:programmId',
    component: () => import('./Programm/DetailView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltungen',
        },
        {
          text: 'Programm',
        },
      ],
    },
  },
  {
    name: 'ProgrammErstellenView',
    path: '/veranstaltung/:veranstaltungId/programm/erstellen',
    component: () => import('./Programm/ErstellenView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltungen',
        },
        {
          text: 'Programm',
        },
        {
          text: 'Erstellen',
        },
      ],
    },
  },
  {
    name: 'LageplanView',
    path: '/veranstaltung/:veranstaltungId/lageplan',
    component: () => import('./LageplanView.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Veranstaltungen',
        },
        {
          text: 'Lageplan',
        },
      ],
    },
  },
]

export default routesVeranstaltungen
