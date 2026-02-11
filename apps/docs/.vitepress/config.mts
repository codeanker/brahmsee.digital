import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'brahmsee.digital',
  description: 'Documentation for brahmsee.digital',
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],

    sidebar: [
      {
        text: 'Development',
        items: [
          { text: 'Testing Guide', link: '/testing' },
          { text: 'App Structure', link: '/app-structure' },
        ],
      },
      {
        text: 'Domain Knowledge',
        items: [
          { text: 'Anmelde Entity', link: '/anmelde-entity' },
          { text: 'Qualifikationen', link: '/qualifikationen' },
          { text: 'Bugs and Workarounds', link: '/bugs-and-workarounds' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/codeanker/brahmsee.digital' }],
  },
})
