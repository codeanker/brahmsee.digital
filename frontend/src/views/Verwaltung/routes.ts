import type { Route } from '@/router'

const routesVerwaltung: Route[] = [
  {
    name: 'Alle Benutzer',
    path: '/verwaltung/benutzer',
    component: () => import('./Benutzer/List.vue'),
  },
  {
    name: 'Benutzer erstellen',
    path: '/verwaltung/benutzer/erstellen',
    component: () => import('./Benutzer/Create.vue'),
  },
  {
    name: 'Benutzerdetails',
    path: '/verwaltung/benutzer/:id',
    component: () => import('./Benutzer/Detail.vue'),
  },

  {
    name: 'Alle Gliederungen',
    path: '/verwaltung/gliederungen',
    component: () => import('./Gliederungen/GliederungList.vue'),
  },
  {
    name: 'Gliederungen erstellen',
    path: '/verwaltung/gliederungen/erstellen',
    component: () => import('./Gliederungen/GliederungCreate.vue'),
  },
  {
    name: 'Gliederungsdetails',
    path: '/verwaltung/gliederungen/:gliederungId',
    component: () => import('./Gliederungen/GliederungDetail.vue'),
  },
  {
    name: 'Accountanfrage',
    path: '/verwaltung/gliederungen/anfrage',
    component: () => import('./Accountanfrage.vue'),
  },

  {
    name: 'Alle Orte',
    path: '/verwaltung/orte',
    component: () => import('./Orte/List.vue'),
  },
  {
    name: 'Ort erstellen',
    path: '/verwaltung/orte/erstellen',
    component: () => import('./Orte/Create.vue'),
  },
  {
    name: 'Ort Details',
    path: '/verwaltung/orte/:id',
    component: () => import('./Orte/Detail.vue'),
  },

  {
    name: 'Alle Veranstaltungen',
    path: '/verwaltung/veranstaltung',
    component: () => import('./Veranstaltungen/VerwaltungVeranstaltungList.vue'),
  },
  {
    name: 'Veranstaltung erstellen',
    path: '/verwaltung/veranstaltung/erstellen',
    component: () => import('./Veranstaltungen/VerwaltungVeranstaltungCreate.vue'),
  },
  {
    name: 'Veranstaltungsdetails',
    path: '/verwaltung/veranstaltung/:veranstaltungId',
    component: () => import('./Veranstaltungen/VerwaltungVeranstaltungDetail.vue'),
  },
]

export default routesVerwaltung