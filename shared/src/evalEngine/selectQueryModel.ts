import QueryParameter from './queryParameter';

export default class SelectQueryModel {
  top: number;
  fromExpression: string;
  whereExpression: string;
  orderByExpression: string;
  parameters: QueryParameter[];

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.top = data.top || 0;
    this.fromExpression = data.fromExpression || '';
    this.whereExpression = data.whereExpression || '';
    this.orderByExpression = data.orderByExpression || '';

    this.parameters = [];
    if (data.parameters) {
      data.parameters.forEach((item: any) => {
        this.parameters.push(new QueryParameter(item));
      });
    }
  }
}
