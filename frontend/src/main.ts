import { polyfill } from "mobile-drag-drop";
// optional import of scroll behaviour
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

// prime vue
import PrimeVue from "primevue/config";
import { definePreset } from "@primevue/themes";
import Lara from "@primevue/themes/lara";
import "primeicons/primeicons.css";

import store from "@/store";
import App from "@/App.vue";
import ChatEntrance from "@/components/pages/ChatEntrance.vue";
import RoomSelection from "@/components/pages/RoomSelection.vue";
import ChatRoom from "@/components/pages/ChatRoom.vue";
import { piniaInstance } from "./piniaInstance";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { name: "entrance", path: "/", component: ChatEntrance },
    { name: "select", path: "/select", component: RoomSelection },
    { path: "/room", redirect: "/select" },
    { name: "room", path: "/room/:id", component: ChatRoom },
  ],
});
const LaraIndigo = definePreset(Lara, {
  semantic: {
    primary: {
      50: "{indigo.50}",
      100: "{indigo.100}",
      200: "{indigo.200}",
      300: "{indigo.300}",
      400: "{indigo.400}",
      500: "{indigo.500}",
      600: "{indigo.600}",
      700: "{indigo.700}",
      800: "{indigo.800}",
      900: "{indigo.900}",
      950: "{indigo.950}",
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(piniaInstance);
app.use(PrimeVue, {
  theme: {
    preset: LaraIndigo,
    options: {
      darkModeSelector: ".my-app-dark",
    },
  },
});

app.mount("#app");

polyfill({
  // use this to make use of the scroll behaviour
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
