import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { useI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import I18nManager from '../../shared/src/i18n/i18nManager';

// Importing PrimeVue styles
import 'primevue/resources/themes/aura-light-blue/theme.css'; // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

I18nManager.setup();

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.use(I18nManager.vueI18n);
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);
app.mount('#app');
