// MySandbox.tsx
import { defineComponent } from 'vue';
import { Sandbox, sandboxProps } from 'vitepress-plugin-sandpack';

export const HcSandbox = defineComponent({
  name: 'HcSandbox',
  props: sandboxProps,
  setup(props, { slots }) {
    return () => (
      <Sandbox
        {...props}
        options={{
          showLineNumbers: true,
          previewHeight: 64,
          showTabs: false,
          showConsoleButton:false,
          autorun:false,
          lightTheme: 'aquaBlue',
          darkTheme: 'cyberpunk',
          template: 'vanilla-ts',
          showNavigator: false
        }}
        customSetup={{
          deps: {
            '@hexancore/common': 'latest',
          },
        }}
      >
        { slots?.default ? slots.default() : null }
      </Sandbox>
    );
  },
});