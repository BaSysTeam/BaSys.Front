import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import Ripple from 'primevue/ripple';
import ToastService from 'primevue/toastservice';
import App from './App.vue';
import router from './router';

// Importing PrimeVue styles
import 'primevue/resources/themes/aura-light-blue/theme.css'; // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

const app = createApp(App);
app.use(router);
app.use(ToastService);
app.use(PrimeVue, { ripple: true });
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);
app.mount('#app');
