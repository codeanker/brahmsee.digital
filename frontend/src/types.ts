import { FunctionalComponent } from 'vue'

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
