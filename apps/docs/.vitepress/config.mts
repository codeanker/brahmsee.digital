import { defineConfig } from 'vitepress'
import { SidebarBuilder } from '@stuyk/vitepress-sidebar-builder'

console.log(SidebarBuilder)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'brahmsee.digital',
  description: 'Documentation for brahmsee.digital',
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],

    sidebar: [
      { text: 'Frontend', items: SidebarBuilder.get.filesAndOrder('./src/frontend', ['_partial']) },
      { text: 'Backend', items: SidebarBuilder.get.filesAndOrder('./src/backend', ['_partial']) },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/codeanker/brahmsee.digital' }],
  },
})
