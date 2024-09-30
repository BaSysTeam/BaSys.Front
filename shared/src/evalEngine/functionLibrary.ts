import SelectQueryBuilder from './selectQueryBuilder';
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
    if (columns != null && columns.length) {
      columns.forEach((column: any) => {
        dataTable.addColumn(column);
      });
    }

    return dataTable;
  }

  static from(fromExpression: string): SelectQueryBuilder {
    const builder = new SelectQueryBuilder();
    builder.from(fromExpression);

    return builder;
  }

  static dateTimeNow(): Date {
    return new Date();
  }

  static dateDifference(startDate: Date, endDate: Date, kind: 'year' | 'month' | 'quarter' | 'day'): number {
    const diffInMilliseconds = endDate.getTime() - startDate.getTime();

    switch (kind) {
      case 'year':
        return endDate.getFullYear() - startDate.getFullYear();

      case 'month':
        return (endDate.getFullYear() - startDate.getFullYear())
          * 12 + (endDate.getMonth() - startDate.getMonth());

      case 'quarter':
        // eslint-disable-next-line no-case-declarations
        const startQuarter = Math.floor(startDate.getMonth() / 3);
        // eslint-disable-next-line no-case-declarations
        const endQuarter = Math.floor(endDate.getMonth() / 3);
        return (endDate.getFullYear() - startDate.getFullYear()) * 4 + (endQuarter - startQuarter);

      case 'day':
        return Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

      default:
        throw new Error('dateDifference. Invalid interval kind.');
    }
  }
}
