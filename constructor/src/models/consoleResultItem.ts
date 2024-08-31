import { Guid } from 'guid-typescript';
import DataTable from '../../../shared/src/evalEngine/dataTable';

export default class ConsoleResultItem {
  uid: string;
  expression: string;
  executionMilliseconds: number;
  resultDisplay!: string;
  table!: DataTable;
  isOpen: boolean;

  constructor(expression: string, executionMilliseconds: number, result: any) {
    this.uid = Guid.create().toString();
    this.isOpen = true;
    this.expression = expression || '';
    this.executionMilliseconds = executionMilliseconds || 0;

    if (result instanceof DataTable) {
      this.table = result;
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
