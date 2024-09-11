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
        return this.innerJoin();
      case 'left':
        return this.leftJoin();
      case 'right':
        return this.rightJoin();
      case 'full':
        return this.fullJoin();
      default:
        throw new Error(`JoinProcessor. Unknown joinKind: ${joinKind}`);
    }
  }

  private innerJoin(): DataTable {
    const resultTable = new DataTable();

    this.createColumns(resultTable);

    this.primaryTable.rows.forEach((primaryRow: any) => {
      const filterResult = this.tableToJoin.rows.filter(
        (joinedRow: any) => this.predicate(primaryRow, joinedRow),
      );

      filterResult.forEach((joinedRow: any) => {
        const newRow = resultTable.newRow(true);
        Object.entries(primaryRow).forEach(([key, value]) => {
          newRow[key] = value;
        });
        Object.entries(joinedRow).forEach(([key, value]) => {
          newRow[key] = value;
        });
      });
    });

    return resultTable;
  }

  private leftJoin(): DataTable {
    const resultTable = new DataTable();

    return resultTable;
  }

  private rightJoin(): DataTable {
    const resultTable = new DataTable();

    return resultTable;
  }

  private fullJoin(): DataTable {
    const resultTable = new DataTable();

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
