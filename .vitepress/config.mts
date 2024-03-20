import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Hexancore",
  base: "/hexancore/",
  lang: 'en-US',
  srcDir: './src',
  cleanUrls: true,
  description: "Full-Stack TypeScript framework for building Epic Modular HexArch designed apps",
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Guide', link: '/guide/what-is-hexancore' },
      { text: 'Cookbook', link: '/cookbook/' },
      { text: 'Reference', link: '/reference/' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          collapsed: false,
          items: [
            { text: 'What is hexancore', link: '/guide/what-is-hexancore' },
            { text: 'Getting Started', link: '/guide/getting-started' },
          ]
        },
        {
          text: 'Basics',
          collapsed: false,
          items: [
            { text: 'Result', link: '/guide/result' },
            { text: 'Module', link: '/guide/module' },
          ]
        }
      ],
      '/cookbook/': [
        {
          text: 'TODO',
          items: [
            { text: 'TODO', link: '/cookbook/todo' },
          ]
        }
      ],
      '/reference/': [
        {
          text: '@hexancore/common',
          items: [
            { text: 'Result', link: '/reference/Result' },
            { text: 'Error', link: '/reference/Error' },
          ]
        }
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hexancore' }
    ]
  }
})