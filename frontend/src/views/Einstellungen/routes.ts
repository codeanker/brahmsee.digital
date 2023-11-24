import type { Route } from '@/router'

const routesEinstellungen: Route[] = [
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
    component: () => import('./Gliederungen/List.vue'),
  },
  {
    name: 'Gliederungen erstellen',
    path: '/verwaltung/gliederungen/erstellen',
    component: () => import('./Gliederungen/Create.vue'),
  },
  {
    name: 'Gliederungsdetails',
    path: '/verwaltung/gliederungen/:id',
    component: () => import('./Gliederungen/Detail.vue'),
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
    name: 'Ortsdetails',
    path: '/verwaltung/orte/:id',
    component: () => import('./Orte/Detail.vue'),
  },

  {
    name: 'Alle Veranstaltungen',
    path: '/verwaltung/orte',
    component: () => import('./Veranstaltungen/List.vue'),
  },
  {
    name: 'Veranstaltung erstellen',
    path: '/verwaltung/orte/erstellen',
    component: () => import('./Veranstaltungen/Create.vue'),
  },
  {
    name: 'Veranstaltungsdetails',
    path: '/verwaltung/orte/:id',
    component: () => import('./Veranstaltungen/Detail.vue'),
  },
]

export default routesEinstellungen