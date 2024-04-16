// import "./a.less";
import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

let instance: Vue | null = null;

// root selector in `index.html`
const HTML_ROOT = "#this-is-root";

function render({ container }: { container?: HTMLElement } = {}) {
  instance = new Vue({
    render: (h) => h(App),
  }).$mount((container || document.body).querySelector(HTML_ROOT)!);
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

export async function bootstrap(props: any) {
  console.log(`[${props?.name}] micro app bootstraped`);
}
export async function mount(props: any) {
  console.log(`[${props?.name}] micro app is gonna mounted`, props);
  render(props);
}
export async function unmount(props: any) {
  console.log(`[${props?.name}] micro app is gonna unmounted`, props);
  if (instance) {
    instance.$destroy();
    instance.$el.innerHTML = "";
    instance = null;
  }
}
