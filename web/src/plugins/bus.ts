import { App } from "vue";
import mitt from "mitt";
import { Emitter } from "mitt";
const emitter: Emitter = mitt();
export default {
  install: (app: App, options: any[]) => {
    app.config.globalProperties.$bus = emitter;
  },
};
