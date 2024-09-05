// eslint-disable-next-line import/no-cycle
import DataTable from './dataTable';
import DataTableColumn from './dataTableColumn';
import GroupingColumn from './groupingColumn';

export default class GroupByProcessor {
  dataTable: DataTable;
  keyColumns: GroupingColumn[];
  groupingColumns: GroupingColumn[];

  constructor(dataTable: DataTable, keyColumns: any[], groupingColumns: any[]) {
    this.dataTable = dataTable;

    this.keyColumns = this.parseGroupingColumns(keyColumns);
    this.groupingColumns = this.parseGroupingColumns(groupingColumns);
  }

  process(): DataTable {
    const groupedTable = new DataTable();
    const sourceKeyColumns: DataTableColumn[] = [];
    const sourceGroupingColumns: DataTableColumn[] = [];

    // Find key columns.
    this.keyColumns.forEach((groupingColumn: GroupingColumn) => {
      const column = this.dataTable.getColumn(groupingColumn.name);

      if (!column) {
        throw new Error(`Column ${groupingColumn.name} not found`);
      }
      sourceKeyColumns.push(column);
      groupedTable.addColumn(column);
    });

    // Create key column.
    const keyColumnName = '__key';
    this.dataTable.addColumn({ name: keyColumnName });

    // Find grouping columns.
    this.groupingColumns.forEach((gColumn: GroupingColumn) => {
      const column = this.dataTable.getColumn(gColumn.name);
      if (!column) {
        throw new Error(`Column ${gColumn.name} not found`);
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
      const filterResult = this.dataTable.rows.filter((row: any) => row[keyColumnName] === key);
      const totals: any = {};

      sourceGroupingColumns.forEach((sourceColumn: any) => {
        totals[sourceColumn.name] = sourceColumn.defaultValue;
      });

      filterResult.forEach((row: any) => {
        this.groupingColumns.forEach((gColumn: GroupingColumn) => {
          const value = row[gColumn.name];
          if (gColumn.aggregate === 'sum') {
            totals[gColumn.alias] += value;
          } else if (gColumn.aggregate === 'avg') {
            totals[gColumn.alias] += value;
          } else if (gColumn.aggregate === 'min') {
            if (totals[gColumn.alias] === undefined || value < totals[gColumn.alias]) {
              totals[gColumn.alias] = value;
            }
          } else if (gColumn.aggregate === 'max') {
            if (totals[gColumn.alias] === undefined || value > totals[gColumn.alias]) {
              totals[gColumn.alias] = value;
            }
          } else {
            throw new Error(`Unknown aggregate function ${gColumn.aggregate}`);
          }
        });
      });

      this.groupingColumns.forEach((gColumn: GroupingColumn) => {
        if (gColumn.aggregate === 'avg') {
          // eslint-disable-next-line operator-assignment
          totals[gColumn.alias] = totals[gColumn.alias] / filterResult.length;
        }
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

  private parseGroupingColumns(source: any[]): GroupingColumn[] {
    const columns : GroupingColumn[] = [];

    if (!source) {
      return columns;
    }

    source.forEach((item) => {
      if (typeof item === 'string') {
        const gColumn = new GroupingColumn({ name: item });
        columns.push(gColumn);
      } else if (typeof item === 'object') {
        const gColumn = new GroupingColumn(item);
        columns.push(gColumn);
      }
    });

    return columns;
  }
}
