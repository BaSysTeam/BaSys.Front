import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router';

// Importing PrimeVue styles
import 'primevue/resources/themes/aura-light-blue/theme.css'; // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

createApp(App).use(PrimeVue).use(router).mount('#app');
