import { DefaultTheme } from 'vitepress'

export default [
  {
    text: 'Introduction',
    collapsed: false,
    items: [
      { text: 'What is hexancore', link: '/guide/what-is-hexancore' },
      { text: 'Getting Started', link: '/guide/getting-started' },
    ]
  },
  {
    text: 'Architecture Concepts',
    collapsed: false,
    items: [
      { text: 'Introduction', link: '/guide/architecture/index' },
      { text: 'Module', link: '/guide/architecture/module' },
      { text: 'Domain', link: '/guide/architecture/domain' },
      { text: 'Application', link: '/guide/architecture/application' },
      { text: 'Infrastructure', link: '/guide/architecture/infrastructure' },
    ]
  },
  {
    text: 'Basics',
    collapsed: false,
    items: [
      { text: 'Result', link: '/guide/result' },
    ]
  }
] as DefaultTheme.SidebarItem[];