export default class ValuesFormatter {
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

  static formatDate(value: any): string {
    if (!(value instanceof Date)) {
      return value.toString();
    }
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = value.getFullYear();
    return `${day}.${month}.${year}`;
  }

  static formatDateTime(value: any): string {
    if (!(value instanceof Date)) {
      return value.toString();
    }
    const day = String(value.getDate()).padStart(2, '0');
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const year = value.getFullYear();
    const hours = String(value.getHours()).padStart(2, '0');
    const minutes = String(value.getMinutes()).padStart(2, '0');
    const seconds = String(value.getSeconds()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  }
}
