<template>
  <SplitButton
    class="h-full bs-locale-btn"
    :label="selectedLocale"
    :model="locales"
    text
  />
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { useToast } from 'primevue/usetoast';
import { usePrimeVue } from 'primevue/config';
import SplitButton from 'primevue/splitbutton';
import I18nManager from '../../../shared/src/i18n/i18nManager';
import ToastHelper from '../../../shared/src/helpers/toastHelper';
import pvLocaleRu from '../../../shared/src/i18n/primevueLocales/ru.json';
import pvLocaleEn from '../../../shared/src/i18n/primevueLocales/en.json';
import { LocaleKinds } from '../../../shared/src/enums/localeKinds';

@Options({
  components: {
    SplitButton,
  },
})
export default class LanguageSwitcherComponent extends Vue {
  selectedLocale = I18nManager.DEFAULT_LOCALE;
  toastHelper = new ToastHelper(useToast());
  primeVue = usePrimeVue();

  locales = [
    {
      label: LocaleKinds[LocaleKinds.EN],
      command: () => this.changeLocale(LocaleKinds[LocaleKinds.EN]),
    },
    {
      label: LocaleKinds[LocaleKinds.RU],
      command: () => this.changeLocale(LocaleKinds[LocaleKinds.RU]),
    },
  ]

  changeLocale(locale: string): void {
    I18nManager.setLocale(locale);

    this.primeVue.config.locale = locale === LocaleKinds[LocaleKinds.EN] ? pvLocaleEn : pvLocaleRu;
    this.selectedLocale = locale;
    this.toastHelper.info(`The locale has changed to ${this.selectedLocale}`);
  }
}
</script>

<style>
.bs-locale-btn {
  .p-splitbutton-defaultbutton {
    color: white;
  }
  .p-splitbutton-menubutton {
    color: white;
  }
}
</style>
