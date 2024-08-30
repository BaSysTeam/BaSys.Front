import { Guid } from 'guid-typescript';
import DataTable from '../../../shared/src/evalEngine/dataTable';

export default class ConsoleResultItem {
  uid: string;
  expression: string;
  executionDuration: number;
  resultDisplay!: string;
  table!: DataTable;

  constructor(expression: string, executionDuration: number, result: any) {
    this.uid = Guid.create().toString();
    this.expression = expression || '';
    this.executionDuration = executionDuration || 0;

    if (result instanceof DataTable) {
      this.table = result;
    } else {
      this.resultDisplay = JSON.stringify(result, null, 2);
    }
  }

  get isTable(): boolean {
    return !!this.table;
  }
}
