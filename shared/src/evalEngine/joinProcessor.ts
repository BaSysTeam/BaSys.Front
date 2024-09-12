// eslint-disable-next-line import/no-cycle
import DataTable from './dataTable';
import ColumnDescription from './columnDescription';

export default class JoinProcessor {
  primaryTable: DataTable;
  tableToJoin: DataTable;
  predicate: (primaryRow: any, joinedRow: any) => boolean
  columnsSettings: ColumnDescription[];

  constructor(
    primaryTable: DataTable,
    tableToJoin: DataTable,
    predicate: (primaryRow: any, joinedRow: any) => boolean,
    columnSettings: any[],
  ) {
    this.primaryTable = primaryTable;
    this.tableToJoin = tableToJoin;
    this.predicate = predicate;

    this.columnsSettings = [];
    if (columnSettings && columnSettings.length > 0) {
      columnSettings.forEach((column) => {
        this.columnsSettings.push(new ColumnDescription(column));
      });
    }
  }

  process(joinKind: string): DataTable {
    if (!(this.primaryTable instanceof DataTable)) {
      throw new Error('JoinProcessor. primaryTable must be DataTable');
    }

    if (!(this.tableToJoin instanceof DataTable)) {
      throw new Error('JoinProcessor. tableToJoin must be DataTable');
    }

    switch (joinKind) {
      case 'inner':
      case 'left':
      case 'full':
        return this.performJoin(joinKind, this.columnsSettings);
      default:
        throw new Error(`JoinProcessor. Unknown joinKind: ${joinKind}`);
    }
  }

  private performJoin(joinKind: string, columnsSettings: ColumnDescription[]): DataTable {
    const resultTable = new DataTable();
    const isFullJoin = joinKind === 'full';
    const isInnerJoin = joinKind === 'inner';

    this.createColumns(resultTable, columnsSettings);
    const processedColumnName = '__processed';
    this.tableToJoin.addColumn({ name: processedColumnName });

    this.primaryTable.rows.forEach((primaryRow: any) => {
      const filterResult = this.tableToJoin.rows.filter(
        (joinedRow: any) => this.predicate(primaryRow, joinedRow),
      );

      if (filterResult.length) {
        // InnerJoin.
        filterResult.forEach((joinedRow: any) => {
          joinedRow[processedColumnName] = true;
          const newRow = resultTable.newRow(true);
          if (columnsSettings.length) {
            columnsSettings.forEach((column: ColumnDescription) => {
              if (column.isPrimaryTable) {
                newRow[column.alias] = primaryRow[column.name];
              } else if (column.isSecondaryTable) {
                newRow[column.alias] = joinedRow[column.name];
              }
            });
          } else {
            Object.entries(primaryRow).forEach(([key, value]) => {
              newRow[key] = value;
            });
            Object.entries(joinedRow).forEach(([key, value]) => {
              newRow[key] = value;
            });
          }
        });
      } else if (!isInnerJoin) {
        // LeftJoin and FullJoin. Add unprocessed rows from primaryTable.
        const newRow = resultTable.newRow(true);
        if (columnsSettings.length) {
          columnsSettings.forEach((column: ColumnDescription) => {
            if (column.isPrimaryTable) {
              newRow[column.alias] = primaryRow[column.name];
            }
          });
        } else {
          Object.entries(primaryRow).forEach(([key, value]) => {
            newRow[key] = value;
          });
        }
      }
    });

    if (isFullJoin) {
      // FullJoin. Add unprocessed rows from tableToJoin.
      const unprocessedRows = this.tableToJoin.rows.filter(
        (joinedRow: any) => joinedRow[processedColumnName] !== true,
      );

      unprocessedRows.forEach((unprocessedRow: any) => {
        const newRow = resultTable.newRow(true);
        if (columnsSettings.length) {
          columnsSettings.forEach((column: ColumnDescription) => {
            if (column.isSecondaryTable) {
              newRow[column.alias] = unprocessedRow[column.name];
            }
          });
        } else {
          Object.entries(unprocessedRow).forEach(([key, value]) => {
            newRow[key] = value;
          });
        }
      });
    }

    return resultTable;
  }

  private createColumns(resultTable: DataTable, columnSettings: ColumnDescription[]): void {
    if (columnSettings.length) {
      columnSettings.forEach((column) => {
        if (column.isPrimaryTable) {
          // Take column from primary table.
          const sourceColumn = this.primaryTable.getColumn(column.name);
          if (!sourceColumn) {
            throw new Error(`Column primary.${column.name} not found.`);
          }
          resultTable.addColumn({ name: column.alias, dataType: sourceColumn.dataType });
        } else if (column.isSecondaryTable) {
          // Take column from secondary table.
          const sourceColumn = this.tableToJoin.getColumn(column.name);
          if (!sourceColumn) {
            throw new Error(`Column secondary.${column.name} not found.`);
          }
          resultTable.addColumn({ name: column.alias, dataType: sourceColumn.dataType });
        } else {
          throw new Error(`JoinProcessor. Unknown table name: ${column.table}`);
        }
      });
    } else {
      // Auto-create columns in result table.
      this.primaryTable.columns.forEach((column) => {
        resultTable.addColumn(column);
      });

      this.tableToJoin.columns.forEach((column: any) => {
        const existingColumn = resultTable.getColumn(column.name);
        if (!existingColumn) {
          resultTable.addColumn(column);
        }
      });
    }
  }
}
