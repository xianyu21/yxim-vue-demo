import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import en from "./locales/en.json";
import { Select } from "ant-design-vue";
// @ts-ignore
import infiniteScroll from "vue3-infinite-scroll-good";

const i18n = createI18n({
  legacy: false,
  locale: "zh",
  fallbackLocale: "zh",
  messages: {
    en,
  },
});

const app = createApp(App);
app.use(infiniteScroll);
app.use(i18n);
app.use(store);
app.use(router);
app.use(Select);
app.mount("#app");
