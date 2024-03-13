export default class PasswordGenerator {
  private static readonly CAPITAL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  private static readonly SMALL_LETTERS = 'abcdefghijklmnopqrstuvwxyz';
  private static readonly DIGITS = '0123456789';
  private static readonly SPECIAL_CHARACTERS = '!@#$%^&*()-_=+<,>.';

  static generate(passwordLength: number): string {
    let result = '';

    if (passwordLength === 0) {
      return result;
    }

    const allChars = this.CAPITAL_LETTERS
    + this.SMALL_LETTERS
    + this.DIGITS
    + this.SPECIAL_CHARACTERS;

    const charactersLength = allChars.length;
    let counter = 0;
    while (counter < passwordLength) {
      result += allChars.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    return result;
  }
}
