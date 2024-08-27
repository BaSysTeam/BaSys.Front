import DataObjectDetailsTable from './dataObjectDetailsTable';

export default class DataObject {
  header: { [key: string]: any };
  currentRow: { [key: string]: any };
  tables: { [key: string]: DataObjectDetailsTable };
  detailsTables: DataObjectDetailsTable[]

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }
    this.header = {};
    this.currentRow = {};
    this.tables = {};
    this.detailsTables = [];

    this.init(data, false);
  }

  init(data: any, includeOnlyModifiedTables: boolean): void {
    this.header = {};
    if (data.header) {
      Object.entries(data.header).forEach(([key, value]) => {
        this.header[key] = value;
      });
    }

    this.tables = {};
    this.detailsTables = [];
    if (data.detailsTables) {
      data.detailsTables.forEach((item: any) => {
        const table = new DataObjectDetailsTable(item);
        if (includeOnlyModifiedTables) {
          if (item.isModified) {
            this.detailsTables.push(table);
          }
        } else {
          this.detailsTables.push(table);
        }
        this.tables[table.name] = table;
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

    this.detailsTables.forEach((detailTable) => {
      detailTable.rows.forEach((row: any) => {
        Object.entries(row).forEach(([key, value]) => {
          if (this.isDate(value)) {
            row[key] = this.dateToIsoString(value as Date);
          }
        });
      });
    });
  }

  newTable(params: any): DataObjectDetailsTable {
    const newTable = new DataObjectDetailsTable(params);
    this.detailsTables.push(newTable);
    this.tables[newTable.name] = newTable;

    return newTable;
  }
}
