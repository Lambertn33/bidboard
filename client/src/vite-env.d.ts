/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Vue compiler macros
declare const defineProps: <T extends Record<string, any> = Record<string, any>>(
  props?: T
) => Readonly<T>;
declare const defineEmits: <T extends Record<string, any> = Record<string, any>>(
  emits?: T
) => T;
declare const defineExpose: (exposed?: Record<string, any>) => void;
declare const withDefaults: <T extends Record<string, any>, U extends T = T>(
  props: T,
  defaults: U
) => Readonly<U>;

