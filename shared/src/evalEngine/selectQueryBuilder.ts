import SelectQueryModel from './selectQueryModel';
import QueryResult from './queryResult';

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

  query(): QueryResult {
    const queryResult = new QueryResult();

    return queryResult;
  }
}
