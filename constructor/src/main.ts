import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';
import { createI18n } from 'vue-i18n';
import App from './App.vue';
import router from './router';
import UserSettingsProvider from '../../shared/src/dataProviders/userSettingsProvider';
import en from '../../shared/src/i18n/locales/en.json';
import ru from '../../shared/src/i18n/locales/ru.json';

// Importing PrimeVue styles
import 'primevue/resources/themes/aura-light-blue/theme.css'; // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

const userSettingsProvider = new UserSettingsProvider();

async function initializeApp(): Promise<void> {
  try {
    const result = await userSettingsProvider.getUserSettings();
    const locale = result.data.language === 0 ? 'en' : 'ru';

    const i18n = createI18n({
      locale, // set locale
      fallbackLocale: 'en',
      legacy: false, // for latest vue-i18n with Composition API
      globalInjection: true,
      messages: {
        en,
        ru,
      }, // set locale messages
    });

    const app = createApp(App);
    app.use(router);
    app.use(PrimeVue, { ripple: true });
    app.use(ToastService);
    app.use(ConfirmationService);
    app.directive('ripple', Ripple);
    app.directive('tooltip', Tooltip);
    app.use(i18n);

    app.mount('#app');
  } catch (error) {
    console.error('Failed to initialize constructor app', error);
  }
}

initializeApp();
