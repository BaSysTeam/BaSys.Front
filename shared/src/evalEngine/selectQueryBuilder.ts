import QueriesProvider from '../dataProviders/queriesProvider';
import SelectQueryModel from './selectQueryModel';
import DataTable from './dataTable';

export default class SelectQueryBuilder {
  model: SelectQueryModel;

  constructor() {
    this.model = new SelectQueryModel(null);
  }

  from(fromExpression: string): SelectQueryBuilder {
    this.model.fromExpression = fromExpression;
    return this;
  }

  top(topValue: number): SelectQueryBuilder {
    this.model.top = topValue;
    return this;
  }

  where(whereExpression: string): SelectQueryBuilder {
    this.model.whereExpression = whereExpression;
    return this;
  }

  orderBy(orderByExpression: string): SelectQueryBuilder {
    this.model.orderByExpression = orderByExpression;
    return this;
  }

  async query(): Promise<DataTable> {
    console.log('Start query...');
    const provider = new QueriesProvider();
    const result = await provider.execute(this.model);
    console.log('Query executed...', result);

    const tableResult = new DataTable();
    if (result.isOK) {
      if (result.data.columns) {
        result.data.columns.forEach((column: any) => {
          tableResult.addColumn(column);
        });
        if (result.data.rows) {
          result.data.rows.forEach((row: any) => {
            tableResult.addRow(row);
          });
        }
      } else {
        console.error('No columns in result table');
      }
    } else {
      console.error(result.presentation);
    }

    return tableResult;
  }
}
