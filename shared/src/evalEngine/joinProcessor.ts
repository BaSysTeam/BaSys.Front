// eslint-disable-next-line import/no-cycle
import DataTable from './dataTable';

export default class JoinProcessor {
  primaryTable: DataTable;
  tableToJoin: DataTable;
  predicate: (primaryRow: any, joinedRow: any) => boolean

  constructor(
    primaryTable: DataTable,
    tableToJoin: DataTable,
    predicate: (primaryRow: any, joinedRow: any) => boolean,
  ) {
    this.primaryTable = primaryTable;
    this.tableToJoin = tableToJoin;
    this.predicate = predicate;
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
        return this.performJoin(joinKind);
      default:
        throw new Error(`JoinProcessor. Unknown joinKind: ${joinKind}`);
    }
  }

  private performJoin(joinKind: string): DataTable {
    const resultTable = new DataTable();
    const isFullJoin = joinKind === 'full';
    const isInnerJoin = joinKind === 'inner';

    this.createColumns(resultTable);
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
          Object.entries(primaryRow).forEach(([key, value]) => {
            newRow[key] = value;
          });
          Object.entries(joinedRow).forEach(([key, value]) => {
            newRow[key] = value;
          });
        });
      } else if (!isInnerJoin) {
        // LeftJoin and FullJoin. Add unprocessed rows from primaryTable.
        const newRow = resultTable.newRow(true);
        Object.entries(primaryRow).forEach(([key, value]) => {
          newRow[key] = value;
        });
      }
    });

    if (isFullJoin) {
      // FullJoin. Add unprocessed rows from tableToJoin.
      const unprocessedRows = this.tableToJoin.rows.filter(
        (joinedRow: any) => joinedRow[processedColumnName] !== true,
      );

      unprocessedRows.forEach((unprocessedRow: any) => {
        const newRow = resultTable.newRow(true);
        Object.entries(unprocessedRow).forEach(([key, value]) => {
          newRow[key] = value;
        });
      });
    }

    return resultTable;
  }

  private createColumns(resultTable: DataTable): void {
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
