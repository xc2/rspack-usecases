import { registerMicroApps, start } from "qiankun";

registerMicroApps([
  {
    name: "Any string - micro-vue",
    entry: "//localhost:1234", // url of micro-vue's dev server
    container: "#sub", // qiankun/main/index.html
    activeRule: "/vue",
  },
]);

start();
