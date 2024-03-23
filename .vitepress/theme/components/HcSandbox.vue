<template>
  <Sandbox
    :rtl="rtl"
    :template="'vanilla-ts'"
    :light-theme="'aquaBlue'"
    :dark-theme="'cyberpunk'"
    :options="{
      ...props,
      showLineNumbers: true,
      previewHeight: 64,
      showTabs: false,
      showConsoleButton:false,
      autorun:false,
      showNavigator: false
    }"
    :custom-setup="{
      ...props,
      deps: { '@hexancore/common': 'latest', }
    }"
    :code-options="codeOptions"
  >
    <slot />
  </Sandbox>
</template>

<script setup lang="ts">
import { Sandbox, sandboxProps } from 'vitepress-plugin-sandpack';

sandboxProps.options = {...sandboxProps.options, bundlerURL: 'https://sandpack-bundler.codesandbox.io',} as any;
const props = defineProps(sandboxProps);
</script>
