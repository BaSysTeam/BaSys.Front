import DataTableColumn from '@/evalEngine/dataTableColumn';

export default class DataTable {
  private _columns: DataTableColumn[];
  private _rows: any[];

  constructor() {
    this._columns = [];
    this._rows = [];
  }

  public get columns(): DataTableColumn[] {
    return this._columns;
  }

  public get rows(): any[] {
    return this._rows;
  }

  getColumn(columnName: string): DataTableColumn | undefined {
    return this._columns.find((x) => x.name === columnName);
  }

  addColumn(column: DataTableColumn): DataTable {
    const existingColumn = this.getColumn(column.name);

    if (existingColumn) {
      throw new Error(`Column ${column.name} already exists`);
    }

    this._columns.push(column);

    // Add default values of new column to existing rows.
    if (this._rows.length) {
      this._rows.forEach((row: any) => {
        row[column.name] = row[column.defaultValue];
      });
    }

    return this;
  }

  deleteColumn(columnName: string): DataTable {
    const currentColumn = this.getColumn(columnName);
    if (!currentColumn) {
      return this;
    }
    const ind = this._columns.indexOf(currentColumn);
    this._columns.splice(ind, 1);

    // Remove column from existing rows.
    if (this._rows.length) {
      this._rows.forEach((row: any) => {
        delete row[columnName];
      });
    }
    return this;
  }

  newRow(): any {
    if (!this._columns.length) {
      throw new Error('Add columns to DataTable before add rows');
    }

    const newRow: any = {};
    this._columns.forEach((column: any) => {
      newRow[column.name] = column.defaultValue;
    });

    return newRow;
  }

  addRow(data: any): DataTable {
    if (!this._columns.length) {
      throw new Error('Add columns to DataTable before add rows');
    }
    if (Array.isArray(data)) {
      this.fillRowFromArray(data);
    } else if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
      this.fillRowFromObject(data);
    } else {
      throw new Error('Data must be an array or an object');
    }
    return this;
  }

  clear(): DataTable {
    this._columns = [];
    this._rows = [];

    return this;
  }

  private fillRowFromArray(data: any[]): void {
    const newRow = this.newRow();
    this._columns.forEach((column: any, index: number) => {
      if (index <= data.length - 1) {
        newRow[column.name] = data[index];
      }
    });
  }

  private fillRowFromObject(data: any): void {
    const newRow = this.newRow();
    this._columns.forEach((column: any) => {
      if (Object.prototype.hasOwnProperty.call(data, column.name)) {
        newRow[column.name] = data[column.name];
      }
    });
  }
}
