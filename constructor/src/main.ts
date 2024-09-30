/* eslint-disable */
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import UserSettingsProvider from '../../shared/src/dataProviders/userSettingsProvider'
import en from '../../shared/src/i18n/locales/en.json';
import ru from '../../shared/src/i18n/locales/ru.json';

// Importing PrimeVue styles
import 'primevue/resources/themes/aura-light-blue/theme.css'; // theme
import 'primevue/resources/primevue.min.css'; // core css
import 'primeicons/primeicons.css'; // icons
import 'primeflex/primeflex.css';

const app = createApp(App);
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);
app.use(ConfirmationService);
app.directive('ripple', Ripple);
app.directive('tooltip', Tooltip);

const userSettingsProvider = new UserSettingsProvider();

userSettingsProvider.getUserSettings().then((result) => {
  console.log('userSettings', result);
  const locale: any = result.data.language === 0 ? 'en': 'ru';
  console.log('locale', locale);

  const i18n = createI18n({
    locale: locale, // set locale
    fallbackLocale: 'en',
    legacy: false, // for latest vuei18n with compo API
    globalInjection: true,
    messages: {
      en,
      ru
    } // set locale messages
  });
  app.use(i18n);
  app.mount('#app');
  console.log('Constructor app mounted.');
});
