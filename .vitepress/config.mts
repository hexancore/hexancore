import { defineConfig } from 'vitepress';
import container from 'markdown-it-container';
import { renderSandbox } from 'vitepress-plugin-sandpack';
import vueJsx from "@vitejs/plugin-vue-jsx";
import GuideSidebar from './sidebar/GuideSidebar';
import ReferenceSidebar from './sidebar/ReferenceSidebar';

const base = '/';
export default defineConfig({
  title: "Hexancore",
  appearance: 'dark',
  base,
  lang: 'en-US',
  srcDir: './src',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', href: `${base}favicon.ico` }],
    ['link', { rel: 'apple-touch-icon', sizes: '57x57', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '60x60', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '72x72', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '76x76', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '114x114', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '120x120', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '144x144', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '152x152', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: `${base}apple-touch-icon.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${base}android-icon-192x192.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${base}favicon-16x16.png` }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}favicon-32x32.png` }],
    ['link', { rel: 'manifest', href: `${base}manifest.json` }],
    ['meta', { name: 'msapplication-TileColor', content: '#ffffff' }],
    ['meta', { name: 'msapplication-TileImage', content: `${base}ms-icon-144x144.png` }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
  ],
  vite: {
    plugins: [
      vueJsx(),
    ],
  },
  description: "Full-Stack TypeScript framework for building Epic Modular HexArch designed apps",
  sitemap: {
    hostname: 'https://hexancore.dev',
    lastmodDateOnly: false
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: '📖 Guide', link: '/guide/what-is-hexancore' },
      { text: '📘 Reference', link: '/reference/index.md' }
    ],

    sidebar: {
      '/guide/': GuideSidebar,
      '/reference/': ReferenceSidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hexancore' }
    ]
  },
  markdown: {
    theme: {
      light: 'one-light',
      dark: 'houston'
    },
    config(md) {
      md
        // the second parameter is html tag name
        .use(container, 'sandbox', {
          render(tokens, idx) {
            return renderSandbox(tokens, idx, 'sandbox');
          },
        })
        .use(container, 'hc-sandbox', {
          render(tokens, idx) {
            return renderSandbox(tokens, idx, 'hc-sandbox');
          },
        });
    },
  },
});
