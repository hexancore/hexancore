import type { Theme } from 'vitepress';
import { Sandbox } from 'vitepress-plugin-sandpack';
import 'vitepress-plugin-sandpack/dist/style.css';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';
import HcJsonFetcher from './components/HcJsonFetcher.vue';
import HcSandbox from './components/HcSandbox.vue';
import NotFoundPage from './components/NotFoundPage.vue';
import HcBashCommand from './components/HcBashCommand.vue';
import HcWipTag from './components/HcWipTag.vue';
import './style.css';


export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFoundPage)
    });
  },
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp(ctx);
    ctx.app.component('Sandbox', Sandbox);
    ctx.app.component('HcSandbox', HcSandbox);
    ctx.app.component('HcJsonFetcher', HcJsonFetcher);
    ctx.app.component('HcBashCommand', HcBashCommand);
    ctx.app.component('HcWipTag', HcWipTag);
  }
} satisfies Theme;
