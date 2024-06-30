import { DefaultTheme } from 'vitepress'

export default [
  {
    text: 'Reference',
    items: [
      {
        text: '@hexancore/common',
        collapsed: true,
        items: [
          { text: 'Error', link: '/reference/common/error' },
        ]
      },
      {
        text: '@hexancore/mocker',
        collapsed: true,
        items: [

        ]
      },
      {
        text: '@hexancore/core',
        collapsed: true,
        items: [

        ]
      },
      {
        text: '@hexancore/auth',
        collapsed: true,
        items: [
          { text: 'OpenId Connect', link: '/reference/auth/oidc' },
          { text: 'Session', link: '/reference/auth/session' },
        ],
      },
      {
        text: '@hexancore/typeorm',
        collapsed: true,
        items: [

        ]
      },
      {
        text: '@hexancore/cloud',
        collapsed: true,
        items: [

        ]
      },
      {
        text: '@hexancore/vuecore',
        collapsed: true,
        items: [

        ]
      }
    ]
  },

] as DefaultTheme.SidebarItem[];