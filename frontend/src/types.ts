import { FunctionalComponent } from 'vue'
import { RouteRecordRaw } from 'vue-router'

export type Route = RouteRecordRaw & {
  public?: boolean
}

//#region Sidebar

interface SidebarItem {
  name: string
  route: string
  current: boolean
}

export interface NavItem extends SidebarItem {
  icon: FunctionalComponent
}

export interface TeamItem extends SidebarItem {
  id: number
  initial: string
}

//#endregion
