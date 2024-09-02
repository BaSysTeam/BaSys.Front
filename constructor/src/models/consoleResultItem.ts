import { Guid } from 'guid-typescript';
import DataTable from '../../../shared/src/evalEngine/dataTable';
import ValuesFormatter from '../../../shared/src/helpers/valuesFormatter';

export default class ConsoleResultItem {
  uid: string;
  expression: string;
  executionMilliseconds: number;
  resultDisplay!: string;
  table!: DataTable;
  isOpen: boolean;
  isError: boolean;

  constructor(expression: string, isError: boolean, result: any) {
    this.uid = Guid.create().toString();
    this.isOpen = true;
    this.expression = expression || '';
    this.executionMilliseconds = 0;
    this.isError = isError;

    if (result instanceof DataTable) {
      this.table = result;
    } else if (result instanceof Date) {
      this.resultDisplay = ValuesFormatter.formatDateTime(result);
    } else {
      this.resultDisplay = JSON.stringify(result, null, 2);
    }
  }

  get isTable(): boolean {
    return !!this.table;
  }

  get info(): string {
    let result = '';
    if (this.isTable) {
      result = `${this.table.rows.length} rows`;
    }

    result += ` ${Math.round(this.executionMilliseconds)} ms`;

    return result;
  }
}
