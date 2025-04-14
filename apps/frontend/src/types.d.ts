import '@tanstack/vue-table'
import type { RouteLocationNormalizedLoadedGeneric, RouteLocationRaw } from 'vue-router'
import type { Option } from './components/BasicInputs/BasicSelect.vue'

type Breadcrumb = {
  text: string
  to?: RouteLocationRaw
}

type BreadcrumbDefinition = Breadcrumb | ((route: RouteLocationNormalizedLoadedGeneric) => Breadcrumb)

declare module 'vue-router' {
  interface RouteMeta {
    public?: boolean
    breadcrumbs?: BreadcrumbDefinition[]
  }
}

declare module '@tanstack/vue-table' {
  interface ColumnMeta {
    filter?:
      | {
          type: 'select' | 'multi-select'
          options: Option[] | (() => Promise<Option[]>)
        }
      | {
          type: 'text'
        }
      | {
          type: 'date'
        }
      | {
          type: 'date-range'
        }
      | {
          type: 'number'
        }
  }
}
