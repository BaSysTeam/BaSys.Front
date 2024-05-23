import UserSettings from '../models/userSettings';
import UserSettingsProvider from '../dataProviders/userSettingsProvider';
import { LocaleKinds } from '../enums/localeKinds';
import pvLocaleEn from './primevueLocales/en.json';
import pvLocaleRu from './primevueLocales/ru.json';
import I18nManager from './i18nManager';

export default class LocaleSwitcher {
  private static userSettingsProvider = new UserSettingsProvider();

  static async setLocale(primeVue: any, locale?: LocaleKinds): Promise<void> {
    let langLocale = locale;
    let localeName = I18nManager.DEFAULT_LOCALE;
    let pvLocale = localeName === LocaleKinds[LocaleKinds.EN] ? pvLocaleEn : pvLocaleRu;

    if (langLocale === undefined) {
      const userSettings = await this.getUserSettings();
      if (userSettings) {
        langLocale = userSettings.language;
      }
    }

    if (langLocale === LocaleKinds.RU) {
      localeName = LocaleKinds[LocaleKinds.RU];
      pvLocale = pvLocaleRu;
    }

    I18nManager.setLocale(localeName);
    primeVue.config.locale = pvLocale;
  }

  private static async getUserSettings(): Promise<UserSettings | null> {
    const response = await this.userSettingsProvider.getUserSettings();
    if (response.isOK) {
      return response.data;
    }

    return null;
  }
}
