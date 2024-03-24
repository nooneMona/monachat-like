import { polyfill } from "mobile-drag-drop";
// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

// prime vue
import PrimeVue from "primevue/config";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";

import store from "@/store";
import { routes } from "@/routes";
import App from "@/App.vue";

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(PrimeVue);
app.component("TabView", TabView);
app.component("TabPanel", TabPanel);

app.mount("#app");

// options are optional ;)
polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
