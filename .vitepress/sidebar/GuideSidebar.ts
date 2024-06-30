import { docFooterTextGenerator, processWipTag, type HcSidebarItem } from './functions';

export default docFooterTextGenerator(processWipTag([
  {
    text: '☄️ Introduction',
    items: [
      { text: 'What is Hexancore', link: '/guide/what-is-hexancore' },
      { text: 'Getting Started', link: '/guide/getting-started', wip: true },
    ]
  },
  {
    text: '🏛️ Fundamentals',
    items: [
      {
        text: 'Architecture Concepts', link: "/guide/architecture/intro",
      },
      {
        base: "/guide/architecture/module",
        text: "Module",
        collapsed: false,
        items: [
          { text: 'Overview', link: '/module' },
          { text: 'Domain', link: '/domain', wip: true },
          { text: 'Application', link: '/application', wip: true  },
          { text: 'Infrastructure', link: '/infrastructure', wip: true },
          { text: 'Asset', link: '/asset', wip: true },
          { text: 'Component', link: '/component', wip: true },
          { text: 'Service', link: '/service', wip: true },
        ]
      },
      { text: 'Result', link: '/guide/result' },
    ]
  },

  {
    text: '📦 Packages>',
    items: [
      {
        text: 'Auth ',
        collapsed: false,
        base: '/guide/packages/auth',
        items: [
          { text: 'Introduction', link: '/intro', wip: true },
          { text: 'OpenID Connect', link: '/oidc', wip: true },
          { text: 'Session', link: '/session', wip: true }
        ]
      }
    ]
  },
  { text: '📘 API Reference', link: '/reference/', wip: true }
] as HcSidebarItem[]));