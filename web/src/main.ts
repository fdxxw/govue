import { createApp } from "vue";
import App from "./App.vue";
import "./utils/global";
import ElementPlus from "element-plus";
import locale from "element-plus/lib/locale/lang/zh-cn";
import "element-plus/lib/theme-chalk/index.css";
import "./assets/styles/index.scss";
import bus from "./plugins/bus";
import global from "/@/utils/global";
import { stateSymbol, createState } from "./store";

const app = createApp(App);
app.provide(stateSymbol, createState());
app.use(ElementPlus, { locale });
app.use(bus);
app.use(global);
app.mount("#app");