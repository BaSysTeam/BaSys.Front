/**
 * A utility class for formatting numbers and dates.
 */
export default class ValuesFormatter {
  /**
   * Parses the input into a Date object if possible.
   *
   * @param input - The input to parse, which can be a string, Date, or any type.
   * @returns The parsed Date object, or null if parsing failed.
   */
  static parseDate(input: any): Date | null {
    if (input == null || Number.isNaN(input)) {
      return null;
    }
    if (typeof input === 'string') {
      const parsedDate = new Date(input);
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(parsedDate.getTime())) {
        return null;
      }
      return parsedDate;
    }
    if (input instanceof Date) {
      return input;
    }
    return null;
  }

  /**
   * Formats a number with a specified number of decimal digits.
   * If the input is not a number, it returns the input as a string.
   *
   * @param value - The value to format, which can be of any type.
   * @param numberDigits - The number of decimal digits to display.
   * @returns The formatted number string, or the input converted to string if it's not a number.
   */
  static formatNumber(value: any, numberDigits: number): string {
    if (value == null || Number.isNaN(value)) {
      return '';
    }

    if (typeof value !== 'number') {
      return value.toString();
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: numberDigits,
      maximumFractionDigits: numberDigits,
      useGrouping: true,
    }).format(value).replace(/,/g, ' ');
  }

  /**
   * Formats a date input into a 'dd.mm.yyyy' string.
   * If the input is not a valid date, it returns the input as a string.
   *
   * @param input - The date input to format, which can be a string, Date, or any type.
   * @returns The formatted date string, or the input converted to string if it's not a valid date.
   */
  static formatDate(input: any): string {
    const date = this.parseDate(input);
    if (date == null) {
      return input?.toString() ?? '';
    }
    return this.formatDateComponents(date);
  }

  /**
   * Formats a date and time input into a 'dd.mm.yyyy hh:mm:ss' string.
   * If the input is not a valid date, it returns the input as a string.
   *
   * @param input - The date and time input to format, which can be a string, Date, or any type.
   * @param withMilliseconds - Indicates that milliseconds will be included to resul string.
   * @returns The formatted date and time string, or the input
   * converted to string if it's not a valid date.
   */
  static formatDateTime(input: any, withMilliseconds = false): string {
    const date = this.parseDate(input);
    if (date == null) {
      return input?.toString() ?? '';
    }
    const dateComponents = this.formatDateComponents(date);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    if (withMilliseconds) {
      const milliSeconds = String(date.getMilliseconds()).padStart(3, '0');
      return `${dateComponents} ${hours}:${minutes}:${seconds}.${milliSeconds}`;
    }

    return `${dateComponents} ${hours}:${minutes}:${seconds}`;
  }

  private static formatDateComponents(value: Date): string {
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = value.getFullYear();
    return `${day}.${month}.${year}`;
  }
}
