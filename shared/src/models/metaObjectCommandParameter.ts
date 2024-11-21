import { DbType } from '../enums/dbTypes';

export default class MetaObjectCommandParameter {
  name: string;
  value: string;
  dbType: DbType;

  constructor(param: any) {
    let data: any = {};
    if (param) {
      data = param;
    }

    this.name = data.name || '';
    this.value = data.value || '';
    this.dbType = data.dbType || DbType.String;
  }
}
