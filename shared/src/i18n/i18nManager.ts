import { I18n, createI18n } from 'vue-i18n';
import en from './locales/en.json';
import ru from './locales/ru.json';

export default class I18nManager {
  private static i18nInstance: I18n;

  static readonly DEFAULT_LOCALE = 'en';
  static readonly SUPPORT_LOCALES = ['en', 'ru'];

  static get vueI18n(): I18n {
    return this.i18nInstance;
  }

  // Initializer
  static setup(locale = this.DEFAULT_LOCALE): void {
    this.i18nInstance = createI18n({
      locale,
      fallbackLocale: this.DEFAULT_LOCALE,
      legacy: true,
      globalInjection: true,
      messages: {
        en,
        ru,
      },
    });

    this.setLocale(locale);
  }

  // Sets the active locale.
  static setLocale(newLocale: string): void {
    if (this.i18nInstance) {
      this.i18nInstance.global.locale = newLocale;
      document.querySelector('html')?.setAttribute('lang', newLocale);
    }
  }
}
