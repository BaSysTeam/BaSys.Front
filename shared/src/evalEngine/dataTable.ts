import DataTableColumn from './dataTableColumn';

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

  addColumn(params: any): DataTable {
    const column = new DataTableColumn(params);
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
    this._rows.push(newRow);

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

  filter(predicate: (row: any) => boolean): DataTable {
    this._rows = this._rows.filter((row) => predicate(row));
    return this;
  }

  sum(columnName: string): number {
    this.checkExistingColumn(columnName);

    let result = 0;
    this._rows.forEach((row: any) => {
      result += row[columnName];
    });
    return result;
  }

  min(columnName: string): number {
    this.checkExistingColumn(columnName);

    let minValue = Infinity;
    this._rows.forEach((row: any) => {
      if (row[columnName] < minValue) {
        minValue = row[columnName];
      }
    });

    return minValue;
  }

  max(columnName: string): number {
    this.checkExistingColumn(columnName);

    let maxValue = -Infinity;
    this._rows.forEach((row: any) => {
      if (row[columnName] > maxValue) {
        maxValue = row[columnName];
      }
    });

    return maxValue;
  }

  avg(columnName: string): number {
    this.checkExistingColumn(columnName);

    if (!this._rows.length) {
      throw new Error('No rows found');
    }

    let sum = 0;
    let count = 0;
    this._rows.forEach((row: any) => {
      sum += row[columnName];
      count += 1;
    });

    return sum / count;
  }

  process(predicate: (row: any) => void): DataTable {
    this._rows.forEach((row: any) => predicate(row));
    return this;
  }

  groupBy(keyColumns: string[], groupingColumns: any[]): DataTable {
    const groupedTable = new DataTable();
    const sourceKeyColumns: DataTableColumn[] = [];
    const sourceGroupingColumns: DataTableColumn[] = [];

    // Find key columns.
    keyColumns.forEach((columnName: string) => {
      const column = this.getColumn(columnName);

      if (!column) {
        throw new Error(`Column ${columnName} not found`);
      }
      sourceKeyColumns.push(column);
      groupedTable.addColumn(column);
    });

    // Create key column.
    const keyColumnName = '__key';
    this.addColumn({ name: keyColumnName });

    // Find grouping columns.
    groupingColumns.forEach((columnName: any) => {
      const column = this.getColumn(columnName);
      if (!column) {
        throw new Error(`Column ${columnName} not found`);
      }

      sourceGroupingColumns.push(column);
      groupedTable.addColumn(column);
    });

    // Collect unique combinations of key columns.
    const keyMap = new Map<string, any>();

    this._rows.forEach((row: any) => {
      const keyObject:any = {};
      let key = '';
      sourceKeyColumns.forEach((sourceColumn: any) => {
        keyObject[sourceColumn.name] = row[sourceColumn.name];
        key += `${sourceColumn.name}:${row[sourceColumn.name]}|`;
      });
      if (!keyMap.has(key)) {
        keyMap.set(key, keyObject);
      }
      row[keyColumnName] = key;
    });

    // Filter rows by key columns.
    keyMap.forEach((keyObject: any, key:string) => {
      console.log('iterate over map');
      console.log('key', key);
      console.log('keyObject', keyObject);
      const filterResult = this._rows.filter((row: any) => row[keyColumnName] === key);
      const totals: any = {};

      sourceGroupingColumns.forEach((sourceColumn: any) => {
        totals[sourceColumn.name] = sourceColumn.defaultValue;
      });

      filterResult.forEach((row: any) => {
        sourceGroupingColumns.forEach((sourceColumn: any) => {
          totals[sourceColumn.name] += row[sourceColumn.name];
        });
      });

      const newRow = groupedTable.newRow();
      Object.entries(keyObject).forEach(([key, value]) => {
        newRow[key] = value;
      });
      Object.entries(totals).forEach(([key, value]) => {
        newRow[key] = value;
      });
    });

    return groupedTable;
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

  private checkExistingColumn(columnName: string): boolean {
    const currentColumn = this.getColumn(columnName);
    if (!currentColumn) {
      throw new Error(`Column ${columnName} not found`);
    }

    return true;
  }
}
