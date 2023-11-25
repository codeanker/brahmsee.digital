import type { Route } from '@/router'

const routesVerwaltung: Route[] = [
  {
    name: 'Alle Benutzer',
    path: '/verwaltung/benutzer',
    component: () => import('./Benutzer/List.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Benutzer Übersicht',
        },
      ],
    },
  },
  {
    name: 'Benutzer erstellen',
    path: '/verwaltung/benutzer/erstellen',
    component: () => import('./Benutzer/Create.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Benutzer',
        },
        {
          text: 'Erstellen',
        },
      ],
    },
  },
  {
    name: 'Benutzerdetails',
    path: '/verwaltung/benutzer/:id',
    component: () => import('./Benutzer/Detail.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Benutzer',
        },
      ],
    },
  },

  {
    name: 'Alle Gliederungen',
    path: '/verwaltung/gliederungen',
    component: () => import('./Gliederungen/GliederungList.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Gliederungen Übersicht',
        },
      ],
    },
  },
  {
    name: 'Gliederungen erstellen',
    path: '/verwaltung/gliederungen/erstellen',
    component: () => import('./Gliederungen/GliederungCreate.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Gliederungen',
        },
        {
          text: 'Erstellen',
        },
      ],
    },
  },
  {
    name: 'Gliederungsdetails',
    path: '/verwaltung/gliederungen/:gliederungId',
    component: () => import('./Gliederungen/GliederungDetail.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Gliederungen',
        },
      ],
    },
  },
  {
    name: 'Accountanfrage',
    path: '/verwaltung/gliederungen/anfrage',
    component: () => import('./Accountanfrage.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Gliederungen',
        },
        {
          text: 'Anfragen',
        },
      ],
    },
  },

  {
    name: 'Alle Orte',
    path: '/verwaltung/orte',
    component: () => import('./Orte/List.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Orts Übersicht',
        },
      ],
    },
  },
  {
    name: 'Ort erstellen',
    path: '/verwaltung/orte/erstellen',
    component: () => import('./Orte/Create.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Ort',
        },
        {
          text: 'Erstellen',
        },
      ],
    },
  },
  {
    name: 'Ort Details',
    path: '/verwaltung/orte/:id',
    component: () => import('./Orte/Detail.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Ort',
        },
      ],
    },
  },

  {
    name: 'Alle Veranstaltungen',
    path: '/verwaltung/veranstaltung',
    component: () => import('./Veranstaltungen/VerwaltungVeranstaltungList.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Veranstaltungs Übersicht',
        },
      ],
    },
  },
  {
    name: 'Veranstaltung erstellen',
    path: '/verwaltung/veranstaltung/erstellen',
    component: () => import('./Veranstaltungen/VerwaltungVeranstaltungCreate.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Veranstaltung',
        },
        {
          text: 'Erstellen',
        },
      ],
    },
  },
  {
    name: 'Veranstaltungsdetails',
    path: '/verwaltung/veranstaltung/:veranstaltungId',
    component: () => import('./Veranstaltungen/VerwaltungVeranstaltungDetail.vue'),
    meta: {
      breadcrumbs: [
        {
          text: 'Verwaltung',
        },
        {
          text: 'Ort',
        },
      ],
    },
  },
]

export default routesVerwaltung
