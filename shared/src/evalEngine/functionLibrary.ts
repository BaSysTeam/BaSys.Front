import DataTable from './dataTable';

export default class FunctionLibrary {
  static isEmpty(value: any): boolean {
    if (value) {
      return false;
    }
    return true;
  }

  static isNotEmpty(value: any): boolean {
    return !FunctionLibrary.isEmpty(value);
  }

  static iif(
    condition: boolean,
    valueTrue: any,
    valueFalse: any,
  ): any {
    if (condition) {
      return valueTrue;
    }

    return valueFalse;
  }

  static ifs(...args: any[]): any {
    for (let i = 0; i < args.length; i += 2) {
      const expressionResult = args[i];

      if (expressionResult) {
        if (i + 1 < args.length) {
          return args[i + 1];
        }
        return null;
      }
    }
    return null;
  }

  static createTable(columns: any[]):DataTable {
    const dataTable = new DataTable();
    columns.forEach((column: any) => {
      dataTable.addColumn(column);
    });
    return dataTable;
  }
}
