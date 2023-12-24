declare module "*.vue" {
  import Vue from "vue";

  export default Vue;
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: string | undefined;
  }
}
