export default class NameHelper {
  /**
   * Prepares a string to be used as a valid name by applying various transformations.
   *
   * @param {string | null} input - The input string to be prepared.
   * @param {boolean} transliterate - If true, transliterates non-Latin characters
   * to their Latin equivalents.
   * @param {number} maxLength - The maximum length of the resulting name.
   * If 0 or negative, no length limit is applied.
   * @returns {string} The prepared name string.
   *
   * @description
   * This method performs the following operations:
   * 1. If input is null or empty, returns an empty string.
   * 2. Transliterates the input if the transliterate flag is true.
   * 3. Converts the string to lowercase.
   * 4. Replaces spaces with underscores.
   * 5. Removes any characters that are not allowed in the name.
   * 6. Ensures the first character is a valid starting character for a name.
   * 7. Truncates the result to the specified maxLength if applicable.
   */
  static prepareName(input: string | null, transliterate: boolean, maxLength: number): string {
    if (!input) {
      return '';
    }

    let tmp = input;

    if (transliterate) {
      tmp = NameHelper.transliterate(tmp);
    }

    tmp = tmp.toLowerCase();
    let name = '';
    tmp.split('').forEach((ch) => {
      let currentChar = ch;
      if (ch === ' ') currentChar = '_';
      if (name.length === 0) {
        if (NameHelper.isFirstSymbolAllowed((currentChar))) {
          name += currentChar;
        }
      } else if (NameHelper.isSymbolAllowed(currentChar)) {
        name += currentChar;
      }
    });

    if (maxLength > 0) {
      name = name.substring(0, maxLength);
    }

    return name;
  }

  private static transliterate(input: string): string {
    const transliterateMap: { [key: string]: string } = {
      а: 'a',
      б: 'b',
      в: 'v',
      г: 'g',
      д: 'd',
      е: 'e',
      ё: 'yo',
      ж: 'zh',
      з: 'z',
      и: 'i',
      й: 'y',
      к: 'k',
      л: 'l',
      м: 'm',
      н: 'n',
      о: 'o',
      п: 'p',
      р: 'r',
      с: 's',
      т: 't',
      у: 'u',
      ф: 'f',
      х: 'kh',
      ц: 'ts',
      ч: 'ch',
      ш: 'sh',
      щ: 'shch',
      ы: 'y',
      э: 'e',
      ю: 'yu',
      я: 'ya',
      А: 'A',
      Б: 'B',
      В: 'V',
      Г: 'G',
      Д: 'D',
      Е: 'E',
      Ё: 'Yo',
      Ж: 'Zh',
      З: 'Z',
      И: 'I',
      Й: 'Y',
      К: 'K',
      Л: 'L',
      М: 'M',
      Н: 'N',
      О: 'O',
      П: 'P',
      Р: 'R',
      С: 'S',
      Т: 'T',
      У: 'U',
      Ф: 'F',
      Х: 'Kh',
      Ц: 'Ts',
      Ч: 'Ch',
      Ш: 'Sh',
      Щ: 'Shch',
      Ы: 'Y',
      Э: 'E',
      Ю: 'Yu',
      Я: 'Ya',
    };

    return input.split('').map((char) => transliterateMap[char] || char).join('');
  }

  private static isSymbolAllowed(ch: string): boolean {
    const code = ch.charCodeAt(0);

    return (
      code === 95 // "_"
      || (code >= 48 && code <= 57) // [0..9]
      || (code >= 97 && code <= 122) // [a..z]
      || (code >= 1072 && code <= 1103) // [а..я]
    );
  }

  private static isFirstSymbolAllowed(ch: string): boolean {
    const code = ch.charCodeAt(0);

    return (
      code === 95 // "_"
      || (code >= 97 && code <= 122) // [a..z]
      || (code >= 1072 && code <= 1103) // [а..я]
    );
  }
}
