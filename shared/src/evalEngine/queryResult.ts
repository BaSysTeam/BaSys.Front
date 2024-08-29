import { QueryResultKinds } from '../enums/queryResultKinds';
import DataTable from './dataTable';

export default class QueryResult {
  kind: QueryResultKinds;
  table: DataTable;
  value: any;
  message: string;

  constructor() {
    this.kind = QueryResultKinds.Table;
    this.table = new DataTable();
    this.value = null;
    this.message = '';
  }
}
