export default class DataObject {
  header: { [key: string]: any };

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.header = {};
    if (data.header) {
      Object.entries(data.header).forEach(([key, value]) => {
        this.header[key] = value;
      });
    }
  }

  isDate(value: any): boolean {
    return value instanceof Date;
  }

  isDateEmpty(value: Date): boolean {
    return value.getFullYear() === 1
      && value.getMonth() === 0 // Months are zero-indexed in JavaScript
      && value.getDate() === 1;
  }

  pad(value: number): string {
    return (value < 10 ? '0' : '') + value;
  }

  toLocalISOString(date: Date): string {
    return `${date.getFullYear()
    }-${this.pad(date.getMonth() + 1)
    }-${this.pad(date.getDate())
    }T${this.pad(date.getHours())
    }:${this.pad(date.getMinutes())
    }:${this.pad(date.getSeconds())}`;
  }

  dateToIsoString(currentDate: Date): string {
    if (this.isDateEmpty(currentDate)) {
      return '';
    }

    return this.toLocalISOString(currentDate);
  }

  convertDatesToIso(): void {
    Object.entries(this.header).forEach(([key, currentValue]) => {
      if (this.isDate(currentValue)) {
        this.header[key] = this.dateToIsoString(currentValue);
      }
    });
  }
}
