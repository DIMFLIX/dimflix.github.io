import "./assets/base.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Image from 'primevue/image';
import i18n from './i18n'

import { Buffer } from 'buffer';
(window as any).Buffer = Buffer; // Для браузеров, где Buffer не определён:cite[3]

createApp(App)
  .use(PrimeVue, {
      theme: {
          preset: Aura,
          options: {
              prefix: 'p',
              darkModeSelector: 'system',
              cssLayer: false
          }
      }
  })
  .component('Image', Image)
  .use(store)
  .use(router)
  .use(i18n)
  .mount("#app");

// Signal for prerender-spa-plugin to finish rendering
if (typeof document !== 'undefined') {
  document.dispatchEvent(new Event('render-event'))
}
