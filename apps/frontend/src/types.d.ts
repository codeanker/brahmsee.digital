import type { RouteLocationNormalizedLoadedGeneric, RouteLocationRaw } from 'vue-router'

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
