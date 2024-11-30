import en from './help.en.json';
import ru from './help.ru.json';

type HelpData = { [key: string]: string };

export default class HelpService {
  culture: string;
  helpData: HelpData;
  constructor(culture: string) {
    this.culture = culture;
    this.helpData = this.loadHelpData(culture);
  }

  getHelp(key: string): string {
    console.log('getHelp', key);
    console.log('helpData', this.helpData);

    const helpText = this.helpData[key];
    if (!helpText) {
      return `Help text not found for key: ${key}`;
    }
    return helpText;
  }

  private loadHelpData(culture: string): HelpData {
    // Dynamically choose the help data based on the culture
    switch (culture) {
      case 'en':
        return en;
      case 'ru':
        return ru;
      default:
        throw new Error(`Unsupported culture: ${culture}`);
    }
  }
}
