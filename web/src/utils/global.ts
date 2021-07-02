import { App } from "vue";
export default {
  install: (app: App, options: any[]) => {
    const global = app.config.globalProperties;
    global.$host = import.meta.env.VITE_APP_HOST;
  },
};
