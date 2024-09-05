import DataTable from './dataTable';
import DataTableColumn from './dataTableColumn';

export default class GroupByProcessor {
  dataTable: DataTable;
  keyColumns: any[];
  groupingColumns: any[];

  constructor(dataTable: DataTable, keyColumns: any[], groupingColumns: any[]) {
    this.dataTable = dataTable;
    this.keyColumns = keyColumns;
    this.groupingColumns = groupingColumns;
  }

  process(): DataTable {
    const groupedTable = new DataTable();
    const sourceKeyColumns: DataTableColumn[] = [];
    const sourceGroupingColumns: DataTableColumn[] = [];

    // Find key columns.
    this.keyColumns.forEach((columnName: string) => {
      const column = this.dataTable.getColumn(columnName);

      if (!column) {
        throw new Error(`Column ${columnName} not found`);
      }
      sourceKeyColumns.push(column);
      groupedTable.addColumn(column);
    });

    // Create key column.
    const keyColumnName = '__key';
    this.dataTable.addColumn({ name: keyColumnName });

    // Find grouping columns.
    this.groupingColumns.forEach((columnName: any) => {
      const column = this.dataTable.getColumn(columnName);
      if (!column) {
        throw new Error(`Column ${columnName} not found`);
      }

      sourceGroupingColumns.push(column);
      groupedTable.addColumn(column);
    });

    // Collect unique combinations of key columns.
    const keyMap = new Map<string, any>();

    this.dataTable.rows.forEach((row: any) => {
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
      const filterResult = this.dataTable.rows.filter((row: any) => row[keyColumnName] === key);
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
}
