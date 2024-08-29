export default class SelectQueryModel {
  top: number;
  fromExpression: string;
  whereExpression: string;
  orderByExpression: string;

  constructor(params: any) {
    let data: any = {};
    if (params != null) {
      data = params;
    }

    this.top = data.top || 0;
    this.fromExpression = data.fromExpression || '';
    this.whereExpression = data.whereExpression || '';
    this.orderByExpression = data.orderByExpression || '';
  }
}
