import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { Sandbox } from 'vitepress-plugin-sandpack';
import { HcSandbox } from './components/HcSandbox';
import 'vitepress-plugin-sandpack/dist/style.css';
import './style.css'


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('Sandbox', Sandbox);
    ctx.app.component('HcSandbox', HcSandbox);
  }
} satisfies Theme
